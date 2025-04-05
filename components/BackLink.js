import Link from 'next/link';
import styles from '@/styles/BackLink.module.css';

export default function BackLink({ href, label }) {
  return (
    <div className={styles.backLink}>
      <Link href={href}>
        {label || '<<<'}
      </Link>
    </div>
  );
}
