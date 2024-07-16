// assets
import { UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  UserOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const users = {
  id: 'group-users',
  title: 'Utilisateur',
  type: 'group',
  children: [
    {
      id: 'user-list',
      title: 'Liste Utilisateurs',
      type: 'item',
      url: '/users',
      icon: icons.UserOutlined
      //   target: true
    }
  ]
};

export default users;
