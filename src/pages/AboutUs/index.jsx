import { useState } from 'react';
import {
  MapPin, Phone, Clock, Smartphone, CreditCard,
  ShieldCheck, CheckCircle, Users, Star, MessageCircle,
} from 'lucide-react';
import { useAboutUs } from '@features/about/hooks/useAboutUs';
import Spinner from '@components/ui/Spinner/Spinner';
import styles from './AboutUs.module.css';

/* ── Sub-components ── */
const Section = ({ title, children }) => (
  <div className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {children}
  </div>
);

const TagList = ({ items }) => (
  <div className={styles.tagList}>
    {items.map((item, i) => (
      <span key={i} className={styles.tag}>{item}</span>
    ))}
  </div>
);

/* ── Language Toggle ── */
const LangToggle = ({ lang, setLang }) => (
  <div className={styles.langToggle} role="group" aria-label="Language toggle">
    <button
      id="lang-toggle-en"
      className={`${styles.langBtn} ${lang === 'en' ? styles.langBtnActive : ''}`}
      onClick={() => setLang('en')}
      aria-pressed={lang === 'en'}
    >
      EN
    </button>
    <button
      id="lang-toggle-hi"
      className={`${styles.langBtn} ${lang === 'hi' ? styles.langBtnActive : ''}`}
      onClick={() => setLang('hi')}
      aria-pressed={lang === 'hi'}
    >
      हिंदी
    </button>
  </div>
);

/* ── Main Page ── */
const AboutUs = () => {
  const [lang, setLang] = useState('en');
  const { data: info, isLoading, isError } = useAboutUs(lang);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError || !info) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.errorLangRow}>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
        <div className={styles.error}>
          <Smartphone size={48} strokeWidth={1} />
          <h2>About Us info not available yet.</h2>
          <p>Check back soon — our team is setting things up.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── Hero banner ── */}
      <div className={styles.hero}>
        {/* ── Language toggle — top-right corner of hero ── */}
        <div className={styles.heroLangRow}>
          <LangToggle lang={lang} setLang={setLang} />
        </div>

        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroBadge}>
            <MapPin size={13} /> {info.city}, {info.district} · {info.state}
          </div>
          <h1 className={styles.heroTitle}>{info.shopName}</h1>
          {info.tagline && <p className={styles.heroTagline}>{info.tagline}</p>}
          {info.description && <p className={styles.heroDesc}>{info.description}</p>}
          <div className={styles.heroActions}>
            {info.contacts?.[0]?.whatsapp && (
              <a
                href={`https://wa.me/91${info.contacts[0].whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className={styles.ctaBtn}
              >
                <MessageCircle size={16} /> WhatsApp Order
              </a>
            )}
            {info.mapUrl && (
              <a
                href={info.mapUrl}
                target="_blank"
                rel="noreferrer"
                className={`${styles.ctaBtn} ${styles.ctaBtnSecondary}`}
              >
                <MapPin size={16} /> Get Directions
              </a>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.content} container`}>

        {/* ── Highlights ── */}
        {info.highlights?.length > 0 && (
          <Section title="Why Choose Us">
            <div className={styles.highlightGrid}>
              {info.highlights.map((h, i) => (
                <div key={i} className={styles.highlightCard}>
                  <CheckCircle size={18} className={styles.highlightIcon} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Products & Services ── */}
        <div className={styles.twoCol}>
          {info.products?.length > 0 && (
            <Section title="Products We Sell">
              <TagList items={info.products} />
            </Section>
          )}
          {info.repairServices?.length > 0 && (
            <Section title="Repair Services">
              <TagList items={info.repairServices} />
            </Section>
          )}
        </div>

        {/* ── Business Details ── */}
        <div className={styles.infoGrid}>
          {info.workingHours && (
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <Clock size={18} />
                <h3>Working Hours</h3>
              </div>
              <div className={styles.infoCardBody}>
                {info.workingHours.regular && (
                  <div className={styles.hoursRow}>
                    <span>Mon – Thu, Sat – Sun</span>
                    <strong>{info.workingHours.regular}</strong>
                  </div>
                )}
                {info.workingHours.friday && (
                  <div className={styles.hoursRow}>
                    <span>Friday</span>
                    <strong>{info.workingHours.friday}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {info.paymentOptions?.length > 0 && (
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <CreditCard size={18} />
                <h3>Payment Options</h3>
              </div>
              <ul className={styles.bulletList}>
                {info.paymentOptions.map((p, i) => (
                  <li key={i}><CheckCircle size={13} /> {p}</li>
                ))}
              </ul>
            </div>
          )}

          {info.emiInfo?.available && (
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <Star size={18} />
                <h3>EMI Available</h3>
              </div>
              <p className={styles.infoCardText}>{info.emiInfo.description}</p>
            </div>
          )}

          {info.businessType && (
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <ShieldCheck size={18} />
                <h3>Business Type</h3>
              </div>
              <p className={styles.infoCardText}>{info.businessType}</p>
            </div>
          )}
        </div>

        {/* ── Contacts ── */}
        {info.contacts?.length > 0 && (
          <Section title="Contact Us">
            <div className={styles.contactGrid}>
              {info.contacts.map((c, i) => (
                <div key={i} className={styles.contactCard}>
                  <div className={styles.contactAvatar}>
                    <Users size={20} />
                  </div>
                  <div className={styles.contactInfo}>
                    <h4 className={styles.contactName}>{c.name}</h4>
                    <span className={styles.contactRole}>{c.role}</span>
                    <div className={styles.contactLinks}>
                      {c.call && (
                        <a href={`tel:+91${c.call}`} className={styles.contactLink}>
                          <Phone size={13} /> {c.call}
                        </a>
                      )}
                      {c.whatsapp && (
                        <a
                          href={`https://wa.me/91${c.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.contactLink} ${styles.contactWa}`}
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Map ── */}
        {info.mapUrl && (
          <Section title="Find Us">
            <a
              href={info.mapUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.mapLink}
            >
              <MapPin size={16} />
              {info.shopName} · {info.city}, {info.district}, {info.state}
              <span className={styles.mapLinkArrow}>Open in Maps →</span>
            </a>
          </Section>
        )}

      </div>
    </div>
  );
};

export default AboutUs;
