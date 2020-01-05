const Routes = {
    '/': {
        slug: '/',
        label: 'Home',
        icon: 'home'
    },
    /*
    '/wallet': {
        slug: '/wallet',
        label: 'Wallet',
        icon: 'wallet',
        subitems: {
            '/fiat': {
                slug: '/fiat',
                label: 'Local Fiat'
            },
            '/btc': {
                slug: '/btc',
                label: 'Bitcoin'
            },
            '/eth': {
                slug: '/eth',
                label: 'Ethereum'
            },
            '/usd': {
                slug: '/usd',
                label: 'SUSD'
            },
            '/ntd': {
                slug: '/ntd',
                label: 'SNTD'
            },
        }
    },
    */
    '/payrequest': {
        slug: '/payrequest',
        label: 'Pay or Request',
        icon: 'file-invoice-dollar'
    },
    '/convertexchange': {
        slug: '/convertexchange/confirmation',
        label: 'Convert or Exchange',
        icon: 'exchange-alt'
    },
    /*
    '/points': {
        slug: '/points',
        label: 'Points Back',
        icon: 'file-powerpoint'
    },
    */
    '/history': {
        slug: '/history',
        label: 'History',
        icon: 'file-alt'
    },
    '/profile': {
        slug: '/profile',
        label: 'Profile',
        icon: 'user-alt'
    },
    /*
    '/payment': {
        slug: '/payment',
        label: 'Payment Methods',
        icon: 'hand-holding-usd'
    },
    */
    '/support': {
        slug: '/support',
        label: 'Support',
        icon: 'question-circle',
        /*
        subitems: {
            '/terms': {
                slug: '/terms',
                label: 'Terms & Conditions'
            }
        }
        */
    },
    '/login': {
        slug: '/login',
        label: 'Login',
        hidden: true
    },
    '/register': {
        slug: '/register',
        label: 'Register',
        hidden: true
    }
};

module.exports = Routes;
