export const getAdminMenuData: any[] = [
  {
    category: true,
    title: 'Admin Area',
    admin: true,
  },
  {
    title: 'Client',
    key: 'client',
    icon: 'fe fe-user',
    children: [
      {
        title: 'Client Overview',
        key: 'client_overview',
        url: '/client-management/clients',
      },
      {
        title: 'Add Client',
        key: 'add_client',
        url: '/client-management/client',
      },
    ],
  },
  {
    title: 'Content',
    key: 'content',
    icon: 'fe fe-edit',
    children: [
      {
        title: 'Content Overview',
        key: 'content_overview',
        url: '/content-management/contents',
      },
      {
        title: 'Add Content',
        key: 'add_content',
        url: '/content-management/content',
      },
    ],
  },
]

export const getCustomerMenuData: any[] = [
  {
    category: true,
    title: 'Customer Area',
    admin: false,
  },
  {
    title: 'Customer',
    key: 'customer',
    icon: 'fe fe-airplay',
    children: [
      {
        title: 'Dashboard',
        key: 'customer_dashboard',
        url: '/customer/dashboard',
      },
    ],
  },
]
