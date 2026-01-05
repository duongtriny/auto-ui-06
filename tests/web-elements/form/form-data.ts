export const invalidFormData = [
    {
        testCaseName: 'Verify all message when all field empty',
        input: {
            'Full Name': {
                value: '',
                message: 'Please input your full name!'
            },
            'Email': {
                value: '',
                message: 'Please input your email!'
            },
            'Phone Number': {
                value: '',
                message: 'Please input your phone number!'
            },
            'Date of Birth': {
                value: '',
                message: 'Please select your date of birth!You must be at least 18 years old!'
            },
            'Address': {
                value: '',
                message: 'Please input your address!'
            }
        }
    },
    {
        testCaseName: 'Verify message when Phone Number and Birthday are invalid',
        input: {
            'Full Name': {
                value: '',
                message: 'Please input your full name!'
            },
            'Email': {
                value: '',
                message: 'Please input your email!'
            },
            'Phone Number': {
                value: '123456',
                message: 'Phone number must be 10 digits!'
            },
            'Date of Birth': {
                value: '2026-01-05',
                message: 'You must be at least 18 years old!'
            },
            'Address': {
                value: '',
                message: 'Please input your address!'
            }
        }
    }
]

export const validFormData = [
    {
        testCaseName: 'Verify create user successful',
        input: {
            'Full Name': 'Test',
            'Email': 'abc@gmail.com',
            'Phone Number': '1234567890',
            'Date of Birth': '2000-02-05',
            'Address': 'ABC XYZ'
        }
    },
]