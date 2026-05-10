import type { ScreenName } from '../constants/routes';

interface BottomNavProps {
  activeScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const navItems: Array<{ screen: ScreenName; label: string }> = [
  { screen: 'home', label: 'ホーム' },
  { screen: 'map', label: '散歩' },
  { screen: 'review', label: '復習' },
  { screen: 'calendar', label: '記録' },
];

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottomNav" aria-label="画面メニュー">
      {navItems.map((item) => (
        <button
          key={item.screen}
          className={activeScreen === item.screen ? 'navButton active' : 'navButton'}
          type="button"
          onClick={() => onNavigate(item.screen)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
