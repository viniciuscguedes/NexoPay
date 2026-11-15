import React from 'react';

function NavbarItem({ render = true, href, label, onClick, dropdown = false }) {
  if (!render) {
    return false;
  }
  return (
    <li className={dropdown ? '' : 'nav-item'}>
      <a className={dropdown ? 'dropdown-item' : 'nav-link'} href={href} onClick={onClick}>
        {label}
      </a>
    </li>
  );
}

export default NavbarItem;
