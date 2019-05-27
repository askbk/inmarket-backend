// Hash of passord123
const testPasswordHash =
    '$2b$10$6B3pYDPoXgXtMd35NS6lPOdVWzV3Pz2OVl8p9hkFdMOZPNXAofOhi';
const testUsers = [
    // Companies
    // {
    //     userContext: {
    //         "email": "ask@dnb.no",
    //         "name": "DNB",
    //         "firstName": "Ask",
    //         "lastName": "DNB-sjef",
    //         "userType": "company",
    //         "orgNumber": 987654321,
    //         "profilePicturePath": "images/DefaultCompanyPage.png"
    //     },
    //     passwordHash: testPasswordHash
    // },{
    //     userContext: {
    //         "email": "kontakt@inmarket.as",
    //         "name": "InMarket",
    //         "firstName": "aske",
    //         "lastName": "ashes",
    //         "userType": "company",
    //         "orgNumber": 123456789
    //     },
    //     passwordHash: testPasswordHash
    // },
    // Jobseekers
    {
        userContext: {
            login: {
                email: 'aske@aske.no',
                passwordHash: testPasswordHash
            },
            firstName: 'aske',
            lastName: 'ashes',
            userType: 'jobseeker',
            jobseeker: {
                education: 'Bachelor Informatikk',
                type: 'Arbeidssøker'
            },
            skills: [1, 2, 3],
            interests: [6, 4, 5],
            profilePicturePath: 'images/temp2.png'
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                email: 'aski@aski.no',
                passwordHash: testPasswordHash
            },
            firstName: 'aske',
            lastName: 'ashes',
            userType: 'jobseeker',
            jobseeker: {
                education: 'Media og kommunikasjon',
                type: 'Elev'
            },
            skills: [10, 9, 8],
            interests: [2, 7, 5]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                email: 'asko@asko.no',
                passwordHash: testPasswordHash
            },
            firstName: 'asko',
            lastName: 'ashes',
            userType: 'jobseeker',
            jobseeker: {
                education: 'Master i datateknologi',
                type: 'Student'
            },
            skills: [4, 2, 7],
            interests: [1, 7, 3]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                email: 'filip@ask.no',
                passwordHash: testPasswordHash
            },
            firstName: 'filip',
            lastName: 'ashes',
            userType: 'jobseeker',
            jobseeker: {
                education: 'Ski VGS',
                type: 'Arbeidssøker'
            },
            skills: [6, 5, 4],
            interests: [8, 9, 7]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                email: 'ya@yo.no',
                passwordHash: testPasswordHash
            },
            firstName: 'yo',
            lastName: 'ta',
            userType: 'jobseeker',
            jobseeker: {
                education: 'Bachelor i datasikkerhet',
                type: 'Student'
            },
            skills: [8, 6, 5],
            interests: [5, 9, 1]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                email: 'tord@aski.no',
                passwordHash: testPasswordHash
            },
            firstName: 'tord',
            lastName: 'stord',
            userType: 'jobseeker',
            jobseeker: {
                education: 'Fagbrev tømrer',
                type: 'Elev'
            },
            skills: [1, 9, 8],
            interests: [2, 5, 7]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                email: 'agugsi@hello.no',
                passwordHash: testPasswordHash
            },
            firstName: 'agugs',
            lastName: 'ashes',
            userType: 'jobseeker',
            jobseeker: {
                education: 'Fagbrev elektriker',
                type: 'Arbeidssøker'
            },
            skills: [9, 2, 6],
            interests: [2, 3, 9]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                email: 'heyah@yea.com',
                passwordHash: testPasswordHash
            },
            firstName: 'filip',
            lastName: 'ashes',
            userType: 'jobseeker',
            jobseeker: {
                education: 'Sandsli videregående',
                type: 'Elev'
            },
            skills: [7, 5, 4],
            interests: [6, 9, 8]
        },
        passwordHash: testPasswordHash
    },
    // Employees
    {
        userContext: {
            login: {
                passwordHash: testPasswordHash,
                email: 'ask@inmarket.as'
            },
            employee: {
                role: 'Teknologisk leder',
                company: 'InMarket'
            },
            firstName: 'bossman',
            lastName: 'ashes',
            userType: 'employee',
            skills: [3, 4, 5],
            companyId: 2,
            interests: [8, 2, 1],
            profilePicturePath: 'images/temp2.png'
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                passwordHash: testPasswordHash,
                email: 'filip@inmarket.as'
            },
            employee: {
                role: 'Utviklerbossman',
                company: 'InMarket'
            },
            firstName: 'filip',
            lastName: 'heya',
            userType: 'employee',
            skills: [5, 6, 7],
            companyId: 2,
            interests: [5, 8, 3]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                passwordHash: testPasswordHash,
                email: 'marcus@inmarket.as'
            },
            employee: {
                role: 'Utviklerbro',
                company: 'InMarket'
            },
            firstName: 'marcuxz',
            lastName: 'yuo',
            userType: 'employee',
            skills: [8, 9, 10],
            companyId: 2,
            interests: [2, 5, 9]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                passwordHash: testPasswordHash,
                email: 'samuel@inmarket.as'
            },
            employee: {
                role: 'Daglig leder',
                company: 'InMarket'
            },
            firstName: 'samuel',
            lastName: 'biggyboi',
            userType: 'employee',
            skills: [6, 5, 1],
            companyId: 2,
            interests: [2, 4, 7]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                passwordHash: testPasswordHash,
                email: 'skrette@inmarket.as'
            },
            employee: {
                role: 'Personalansvarlig',
                company: 'InMarket'
            },
            firstName: 'skrettebarg',
            lastName: 'samuel',
            userType: 'employee',
            skills: [3, 1, 5],
            companyId: 2,
            interests: [2, 9, 7]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                passwordHash: testPasswordHash,
                email: 'izzy@inmarket.as'
            },
            employee: {
                role: 'Markedsføringsansvarlig',
                company: 'InMarket'
            },
            firstName: 'izraeli',
            lastName: 'bonny',
            userType: 'employee',
            skills: [4, 6, 7],
            companyId: 2,
            interests: [7, 2, 1]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                passwordHash: testPasswordHash,
                email: 'post@inmarket.as'
            },
            employee: {
                role: 'Postbud',
                company: 'InMarket'
            },
            firstName: 'anon',
            lastName: 'yuo',
            userType: 'employee',
            skills: [2, 6, 3],
            companyId: 2,
            interests: [5, 4, 3]
        },
        passwordHash: testPasswordHash
    },
    {
        userContext: {
            login: {
                passwordHash: testPasswordHash,
                email: 'oyvind@inmarket.as'
            },
            employee: {
                role: 'Nestleder',
                company: 'InMarket'
            },
            firstName: 'øyvind',
            lastName: 'aleksander',
            userType: 'employee',
            skills: [3, 4, 2],
            companyId: 2,
            interests: [9, 3, 2]
        },
        passwordHash: testPasswordHash
    }
];

module.exports = testUsers;
