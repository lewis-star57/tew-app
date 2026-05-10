param(
  [string]$AssetsDir = "public/assets",
  [string]$BackupRoot = "backup"
)

$ErrorActionPreference = "Stop"

$targetFiles = @(
  "taffy-main.png",
  "taffy-happy.png",
  "taffy-excited.png",
  "taffy-thinking.png",
  "taffy-cheer.png",
  "taffy-sleepy.png",
  "taffy-surprised.png",
  "taffy-sad.png"
)

$workspace = (Resolve-Path ".").Path
$resolvedAssets = (Resolve-Path $AssetsDir).Path
$resolvedBackupRoot = Join-Path $workspace $BackupRoot
$backupDir = Join-Path $resolvedBackupRoot ("taffy-originals-" + (Get-Date -Format "yyyyMMdd-HHmmss"))

if (-not $resolvedAssets.StartsWith($workspace)) {
  throw "AssetsDir must be inside the workspace."
}

New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

foreach ($name in $targetFiles) {
  $source = Join-Path $resolvedAssets $name
  if (-not (Test-Path -LiteralPath $source)) {
    throw "Missing target image: $source"
  }
  Copy-Item -LiteralPath $source -Destination (Join-Path $backupDir $name) -Force
}

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;

public static class TaffyBackgroundRemover
{
    private static bool IsBackgroundCandidate(Color c)
    {
        if (c.A == 0) return true;
        int max = Math.Max(c.R, Math.Max(c.G, c.B));
        int min = Math.Min(c.R, Math.Min(c.G, c.B));
        int spread = max - min;
        return min >= 232 && spread <= 34;
    }

    private static int QueueIndex(int x, int y, int width)
    {
        return y * width + x;
    }

    public static void RemoveWhiteBackground(string inputPath, string outputPath)
    {
        using (Bitmap source = new Bitmap(inputPath))
        using (Bitmap output = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb))
        {
            int width = source.Width;
            int height = source.Height;
            bool[] background = new bool[width * height];
            Queue<int> queue = new Queue<int>();

            Action<int, int> trySeed = (x, y) =>
            {
                int index = QueueIndex(x, y, width);
                if (!background[index] && IsBackgroundCandidate(source.GetPixel(x, y)))
                {
                    background[index] = true;
                    queue.Enqueue(index);
                }
            };

            for (int x = 0; x < width; x++)
            {
                trySeed(x, 0);
                trySeed(x, height - 1);
            }

            for (int y = 0; y < height; y++)
            {
                trySeed(0, y);
                trySeed(width - 1, y);
            }

            int[] dx = new int[] { 1, -1, 0, 0 };
            int[] dy = new int[] { 0, 0, 1, -1 };

            while (queue.Count > 0)
            {
                int index = queue.Dequeue();
                int x = index % width;
                int y = index / width;

                for (int i = 0; i < 4; i++)
                {
                    int nx = x + dx[i];
                    int ny = y + dy[i];
                    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

                    int nextIndex = QueueIndex(nx, ny, width);
                    if (!background[nextIndex] && IsBackgroundCandidate(source.GetPixel(nx, ny)))
                    {
                        background[nextIndex] = true;
                        queue.Enqueue(nextIndex);
                    }
                }
            }

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    int index = QueueIndex(x, y, width);
                    Color c = source.GetPixel(x, y);

                    if (background[index])
                    {
                        output.SetPixel(x, y, Color.FromArgb(0, c.R, c.G, c.B));
                    }
                    else
                    {
                        output.SetPixel(x, y, Color.FromArgb(c.A, c.R, c.G, c.B));
                    }
                }
            }

            output.Save(outputPath, ImageFormat.Png);
        }
    }
}
"@

foreach ($name in $targetFiles) {
  $path = Join-Path $resolvedAssets $name
  $tempPath = Join-Path $resolvedAssets ($name + ".tmp-" + [Guid]::NewGuid().ToString("N") + ".png")
  [TaffyBackgroundRemover]::RemoveWhiteBackground($path, $tempPath)
  Move-Item -LiteralPath $tempPath -Destination $path -Force
  Write-Output "Converted $name"
}

Write-Output "BackupDir=$backupDir"
