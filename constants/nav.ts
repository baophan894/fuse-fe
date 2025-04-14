import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    items: []
  },
  {
    title: 'Quản lý nhân viên',
    url: '/dashboard/user-management',
    icon: 'user',
    isActive: false,
    items: []
  },
  {
    title: 'Quản lý bảo hiểm',
    url: '/dashboard/insurance',
    icon: 'user',
    isActive: false,
    items: []
  },
  {
    title: 'Quản lý đăng ký cộng tác viên',
    url: '/dashboard/collaborator',
    icon: 'employee',
    isActive: false,
    items: []
  },
  {
    title: 'Quản lý doanh thu',
    url: '#',
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Hợp đồng',
        url: '/dashboard/profile',
        icon: 'userPen'
      },
      {
        title: 'Hoa hồng',
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Thiết lập',
    url: '#',
    icon: 'settings',
    isActive: true,

    items: [
      {
        title: 'Loại bảo hiểm',
        url: '/dashboard/profile',
        icon: 'userPen'
      },
      {
        title: 'Sản phẩm',
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Quản lý nội dung',
    url: '#',
    icon: 'post',
    isActive: true,

    items: [
      {
        title: 'Banner',
        url: '/dashboard/profile',
        icon: 'userPen'
      },
      {
        title: 'Bài viết',
        url: '/',
        icon: 'login'
      }
    ]
  },
];
