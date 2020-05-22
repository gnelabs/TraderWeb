import { Auth } from 'aws-amplify';

// Logs out and reloads, which will make the user redirected to /login.
async function signOut() {
  await Auth.signOut();
  window.location.reload();
}

export default {
  items: [
    {
      title: true,
      name: 'Tools',
    },
    {
      name: 'Dashboard',
      url: '/',
      icon: 'fa fa-line-chart',
      attributes: {
        exact: true
      },
    },
    {
      title: true,
      name: 'Controls',
    },
    {
      name: 'Settings',
      url: '/settings',
      icon: 'fa fa-toggle-on',
    },
    {
      name: 'Log Out',
      url: '/login',
      icon: 'fa fa-sign-out',
      attributes: { onClick: signOut },
    },
    {
      divider: true,
    },
    {
      title: true,
      name: 'Info',
    },
    {
      name: 'Documentation',
      icon: 'fa fa-file-text-o',
      itemAttr: { id: 'drop-1' },
      children: [
        {
          name: 'Frontend React Site',
          url: 'https://github.com/gnelabs/TraderWeb',
          icon: 'fa fa-file-code-o',
          attributes: {
            target: '_blank',
            rel: "noreferrer noopener",
            disabled: false,
            hidden: false,
          },
        },
      ]
    }
  ]
};
