import { useRef, useState } from 'react';

interface DataManagementPanelProps {
  onBackupProgress: () => void;
  onRestoreProgress: (file: File) => Promise<string | null>;
  onShowTutorial: () => void;
  onResetProgress: () => void;
}

export function DataManagementPanel({
  onBackupProgress,
  onRestoreProgress,
  onShowTutorial,
  onResetProgress,
}: DataManagementPanelProps) {
  const restoreInputRef = useRef<HTMLInputElement | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const handleBackup = () => {
    onBackupProgress();
    setRestoreMessage('学習データのバックアップを作りました。');
  };

  const handleRestoreClick = () => {
    restoreInputRef.current?.click();
  };

  const handleRestoreFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    const confirmed = window.confirm('現在の学習データを上書きします。よろしいですか？');

    if (!confirmed) {
      return;
    }

    try {
      const errorMessage = await onRestoreProgress(file);
      setRestoreMessage(errorMessage ?? '学習データを復元しました。');
    } catch {
      setRestoreMessage('復元中にエラーが起きました。別のバックアップファイルを選んでください。');
    }
  };

  return (
    <details className="panel resetPanel dataManagementPanel">
      <summary>データ管理</summary>
      <div className="resetPanelContent">
        <section className="dataManagementSection">
          <h2>はじめてガイド</h2>
          <p>使い方をもう一度見たい時は、ホーム画面にガイドを表示できます。</p>
          <button className="secondaryButton" type="button" onClick={onShowTutorial}>
            はじめてガイドをもう一度見る
          </button>
        </section>
        <section className="dataManagementSection">
          <h2>バックアップ・復元</h2>
          <p>
            端末変更やブラウザデータ削除に備えて、今の学習データをJSONファイルとして保存できます。
          </p>
          <div className="resetActions">
            <button className="primaryButton" type="button" onClick={handleBackup}>
              学習データをバックアップ
            </button>
            <button className="secondaryButton" type="button" onClick={handleRestoreClick}>
              学習データを復元
            </button>
          </div>
          <input
            ref={restoreInputRef}
            className="hiddenFileInput"
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              void handleRestoreFile(event.currentTarget.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
          {restoreMessage ? <p className="backupRestoreStatus">{restoreMessage}</p> : null}
        </section>
        <section className="dataManagementSection">
          <h2>学習データをリセット</h2>
          <p>
            XP（経験値）、レベル、おやつ、連続日数、苦手フレーズなどを最初からに戻します。
          </p>
          {isConfirmingReset ? (
            <div className="resetActions">
              <button className="dangerButton" type="button" onClick={onResetProgress}>
                本当にリセットする
              </button>
              <button className="secondaryButton" type="button" onClick={() => setIsConfirmingReset(false)}>
                キャンセル
              </button>
            </div>
          ) : (
            <button className="dangerButton" type="button" onClick={() => setIsConfirmingReset(true)}>
              学習データをリセット
            </button>
          )}
        </section>
      </div>
    </details>
  );
}
