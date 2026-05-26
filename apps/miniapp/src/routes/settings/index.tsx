import { useState } from 'react';
import { useFamilyId, useTelegramUser } from '@/hooks';
import {
  AppShell,
  IconBadge,
  ListCard,
  PremiumCard,
  PrimaryButton,
  SegmentedControl,
  StatusPill,
} from '@/components/app/premium';
import { triggerNotification } from '@/components/app/telegram-theme';

const LANG_OPTIONS = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
] as const;

type Lang = (typeof LANG_OPTIONS)[number]['value'];

function getInitialLang(): Lang {
  const saved = localStorage.getItem('lang');
  return saved === 'ru' || saved === 'en' ? saved : 'uz';
}

export function SettingsPage() {
  const familyId = useFamilyId();
  const user = useTelegramUser();
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [notifications, setNotifications] = useState(true);
  const [dndFrom, setDndFrom] = useState('22:00');
  const [dndTo, setDndTo] = useState('08:00');
  const [saved, setSaved] = useState(false);

  const handleLangChange = (nextLang: Lang) => {
    setLang(nextLang);
    setSaved(false);
    localStorage.setItem('lang', nextLang);
  };

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify({ notifications, dndFrom, dndTo, lang }));
    setSaved(true);
    triggerNotification('success');
  };

  return (
    <AppShell eyebrow="Profil" title="Sozlamalar" description="Til, bildirishnoma va oilaviy profil sozlamalari.">
      <PremiumCard tone="mint">
        <div className="row">
          <div className="brand-lockup">
            <span className="logo-mark">{user?.first_name?.slice(0, 1).toLowerCase() ?? 'u'}</span>
            <div>
              <strong>
                {user?.first_name ?? 'Foydalanuvchi'} {user?.last_name ?? ''}
              </strong>
              <span>Oila: {familyId ? `${familyId.slice(0, 8)}...` : '—'}</span>
            </div>
          </div>
          <StatusPill tone="mint">Mini App</StatusPill>
        </div>
      </PremiumCard>

      <section className="section-head">
        <h2>Til</h2>
      </section>
      <SegmentedControl label="Tilni tanlash" value={lang} onChange={handleLangChange} options={LANG_OPTIONS} />

      <section className="section-head">
        <h2>Bildirishnomalar</h2>
      </section>
      <PremiumCard>
        <div className="row">
          <div className="brand-lockup">
            <IconBadge icon="bell" tone="yellow" />
            <div>
              <strong>Bot orqali xabar olish</strong>
              <span>Telegram reminder va oilaviy xabarlar</span>
            </div>
          </div>
          <label className="switch-control" aria-label="Bot orqali xabar olish">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) => {
                setNotifications(event.target.checked);
                setSaved(false);
              }}
            />
            <span />
          </label>
        </div>

        {notifications ? (
          <div className="form-grid mt-4">
            <label className="form-label">
              DND boshlanishi
              <input className="input" type="time" value={dndFrom} onChange={(event) => setDndFrom(event.target.value)} />
            </label>
            <label className="form-label">
              DND tugashi
              <input className="input" type="time" value={dndTo} onChange={(event) => setDndTo(event.target.value)} />
            </label>
          </div>
        ) : null}
      </PremiumCard>

      <section className="section-head">
        <h2>Dastur haqida</h2>
      </section>
      <div className="stack">
        <ListCard icon="home" title="Uyimiz" subtitle="Telegram Mini App · Oila boshqaruv platformasi" tone="mint" />
        <ListCard icon="settings" title="Versiya" subtitle="v0.1.0" tone="blue" />
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={handleSave}>{saved ? 'Saqlandi' : 'Saqlash'}</PrimaryButton>
      </div>
    </AppShell>
  );
}
