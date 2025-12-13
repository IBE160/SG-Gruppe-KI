import React from 'react';

// This mock is for `next/link`
// It forwards the `href` to a regular `<a>` tag and passes all other props.
const Link = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export default Link;
