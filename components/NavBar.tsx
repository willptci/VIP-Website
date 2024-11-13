// components/Navbar.tsx
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/services">Ecommerce</Link>
        </li>    
        <li className={styles.profileContainer}>
          <Link href="/profile">Profile</Link>
          <div className={styles.dropdownContent}>
            <Link href="/profile">User Profile Page</Link>
            <Link href="/purchases">Purchases</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
