// Hash of passord123
const testPasswordHash = "$2b$10$6B3pYDPoXgXtMd35NS6lPOdVWzV3Pz2OVl8p9hkFdMOZPNXAofOhi";
const testUsers = [
    // Companies
    {
        userContext: {
            "email": "ask@dnb.no",
            "name": "DNB",
            "firstName": "Ask",
            "lastName": "DNB-sjef",
            "userType": "company",
            "orgNumber": 987654321
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "kontakt@inmarket.as",
            "name": "InMarket",
            "firstName": "aske",
            "lastName": "ashes",
            "userType": "company",
            "orgNumber": 123456789
        },
        passwordHash: testPasswordHash
    },
    // Jobseekers
    {
        userContext: {
            "email": "aske@aske.no",
            "firstName": "aske",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [1, 2, 3]
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "aski@aski.no",
            "firstName": "aske",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [10, 9, 8]
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "asko@asko.no",
            "firstName": "asko",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [4, 2, 7]
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "filip@ask.no",
            "firstName": "filip",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [6, 5, 4]
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "ya@yo.no",
            "firstName": "yo",
            "lastName": "ta",
            "userType": "jobseeker",
            "skills": [8, 6, 5]
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "tord@aski.no",
            "firstName": "tord",
            "lastName": "stord",
            "userType": "jobseeker",
            "skills": [1, 9, 8]
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "agugsi@hello.no",
            "firstName": "agugs",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [9, 2, 6]
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "heyah@yea.com",
            "firstName": "filip",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [7, 5, 4]
        },
        passwordHash: testPasswordHash
    },
    // Employees
    {
        userContext: {
            "email": "ask@inmarket.as",
            "firstName": "bossman",
            "lastName": "ashes",
            "userType": "employee",
            "skills": [3, 4, 5],
            "companyId": 2,
            "role": "Teknologisk leder"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "filip@inmarket.as",
            "firstName": "filip",
            "lastName": "heya",
            "userType": "employee",
            "skills": [5, 6, 7],
            "companyId": 2,
            "role": "Utviklerbossman"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "marcus@inmarket.as",
            "firstName": "marcuxz",
            "lastName": "yuo",
            "userType": "employee",
            "skills": [8, 9, 10],
            "companyId": 2,
            "role": "Utviklerbro"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "samuel@inmarket.as",
            "firstName": "samuel",
            "lastName": "biggyboi",
            "userType": "employee",
            "skills": [6, 5, 1],
            "companyId": 2,
            "role": "Daglig leder"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "skrette@inmarket.as",
            "firstName": "skrettebarg",
            "lastName": "samuel",
            "userType": "employee",
            "skills": [3, 1, 5],
            "companyId": 2,
            "role": "Personalansvarlig"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "izzy@inmarket.as",
            "firstName": "izraeli",
            "lastName": "bonny",
            "userType": "employee",
            "skills": [4, 6, 7],
            "companyId": 2,
            "role": "Markedsføringsansvarlig"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "post@inmarket.as",
            "firstName": "anon",
            "lastName": "yuo",
            "userType": "employee",
            "skills": [2, 6, 3],
            "companyId": 2,
            "role": "Postbud"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "oyvind@inmarket.as",
            "firstName": "øyvind",
            "lastName": "aleksander",
            "userType": "employee",
            "skills": [3, 4, 2],
            "companyId": 2,
            "role": "Nestleder"
        },
        passwordHash: testPasswordHash
    },

];

module.exports = testUsers;
