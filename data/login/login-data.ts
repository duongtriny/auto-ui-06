export const invalidLogin = [
    {
        testCaseName: 'Verify email is empty',
        input: {
            'Email': '',
            'Password': '123456789'
        },
        expect: {
            'Email': 'Email is required'
        }
    },
    {
        testCaseName: 'Verify password is empty',
        input: {
            'Email': 'test@with.me',
            'Password': ''
        },
        expect: {
            'Password': 'Password is required'
        }
    },
    {
        testCaseName: 'Verify email and password are empty',
        input: {
            'Email': '',
            'Password': ''
        },
        expect: {
            'Email': 'Email is required',
            'Password': 'Password is required'
        }
    }
]