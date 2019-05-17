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
            "orgNumber": 987654321,
            "profilePicturePath": "images/DefaultCompanyPage.png"
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
            "education": "Bachelor Informatikk",
            "type": "Arbeidssøker",
            "skills": [1, 2, 3],
            "interests": [6, 4, 5],
            "profilePicturePath": "images/temp2.png"

        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "aski@aski.no",
            "firstName": "aske",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [10, 9, 8],
            "interests": [2, 7, 5],
            "education": "Media og kommunikasjon",
            "type": "Elev"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "asko@asko.no",
            "firstName": "asko",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [4, 2, 7],
            "interests": [1, 7, 3],
            "education": "Master i datateknologi",
            "type": "Student"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "filip@ask.no",
            "firstName": "filip",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [6, 5, 4],
            "interests": [8, 9, 7],
            "education": "Ski VGS",
            "type": "Arbeidssøker"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "ya@yo.no",
            "firstName": "yo",
            "lastName": "ta",
            "userType": "jobseeker",
            "skills": [8, 6, 5],
            "interests": [5, 9, 1],
            "education": "Bachelor i datasikkerhet",
            "type": "Student"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "tord@aski.no",
            "firstName": "tord",
            "lastName": "stord",
            "userType": "jobseeker",
            "skills": [1, 9, 8],
            "interests": [2, 5, 7],
            "education": "Fagbrev tømrer",
            "type": "Elev"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "agugsi@hello.no",
            "firstName": "agugs",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [9, 2, 6],
            "interests": [2, 3, 9],
            "education": "Fagbrev elektriker",
            "type": "Arbeidssøker"
        },
        passwordHash: testPasswordHash
    },{
        userContext: {
            "email": "heyah@yea.com",
            "firstName": "filip",
            "lastName": "ashes",
            "userType": "jobseeker",
            "skills": [7, 5, 4],
            "interests": [6, 9, 8],
            "education": "Sandsli videregående",
            "type": "Elev"
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
            "role": "Teknologisk leder",
            "interests": [8, 2, 1],
            "profilePicturePath": "images/temp2.png"

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
            "role": "Utviklerbossman",
            "interests": [5, 8, 3]
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
            "role": "Utviklerbro",
            "interests": [2, 5, 9]
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
            "role": "Daglig leder",
            "interests": [2, 4, 7]
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
            "role": "Personalansvarlig",
            "interests": [2, 9, 7]
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
            "role": "Markedsføringsansvarlig",
            "interests": [7, 2, 1]
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
            "role": "Postbud",
            "interests": [5, 4, 3]
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
            "role": "Nestleder",
            "interests": [9, 3, 2]
        },
        passwordHash: testPasswordHash
    },

];

module.exports = testUsers;
