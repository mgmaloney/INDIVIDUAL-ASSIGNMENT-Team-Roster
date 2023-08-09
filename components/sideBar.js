import Link from 'next/link';

export default function SideBar() {
  return (
    <>
      <div className="sidebar-main">
        <Link passHref href="/">
          Calendar
        </Link>
        <Link passHref href="/clients">
          Clients
        </Link>
        <Link passHref href="/reminders">
          Reminders
        </Link>
        <Link passHref href="/settings">
          Settings
        </Link>
      </div>
    </>
  );
}
