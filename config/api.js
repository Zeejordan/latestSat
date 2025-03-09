// export const BASE_URL = "http://192.168.1.21:8000/api/"
export const BASE_URL = "http://89.116.134.150:8085/api/"
export const IMG_URL = "http://89.116.134.150:8085/";

export const LOGIN = BASE_URL + "user/login"                            // POST
export const VERIFY_OTP = BASE_URL + "user/verify-otp"                  // POST
export const REGISTER_PROFILE = BASE_URL + "user/register-profile/"     // POST

// below we have api of quiz
export const QUIZ_LIST = BASE_URL + "test-list/"                // GET
export const QUIZ_LIST_COMPLETE = BASE_URL + "get-test-details/"                // GET(fir progress id k baad ek slash hai)
export const QUIZ_ANSWERS = BASE_URL + "session/"

export const ENGLISH_MODULE = BASE_URL + "first-module-eng"          // GET
export const ENGLISH_SUBMIT_MODULE_FIRST = BASE_URL + "submit-first-module/"     // POST
export const ENGLISH_SECOND_MODULE = BASE_URL + "second-module/"                     // POST
export const ENGLISH_SUBMIT_MODULE_SECOND = BASE_URL + "submit-second-modules/"  // POST
export const MATHS_FIRST_MODULE = BASE_URL + "first-module-math/"                 // POST
export const MATHS_FIRST_MODULE_SUBMIT = BASE_URL + "submit-first-module-math/"                 // POST
export const MATHS_SECOND_MODULE = BASE_URL + "second-module-math/"                 // POST
export const MATHS_SECOND_MODULE_SUBMIT = BASE_URL + "submit-second-module-math/"                 // POST

// below we have api of levels
export const LEVELS_STARTING = BASE_URL + "user/get-levels"   // GET (BUT IT HAS PAYLOAD)
export const LEVELS_PROGRESSION = BASE_URL + "user/questions/"   // GET (BUT IT HAS PAYLOAD)
export const LEVELS_PAGINATION_API = BASE_URL + "user/get-answer?current_index="   // GET (BUT IT HAS PAYLOAD)

// below we have user profile related api's
export const GET_USER_DETAILS = BASE_URL + "user/get-profile/"               // GET
export const UPDATE_USER_DETAILS = BASE_URL + "user/update-profile/"               // put

// HomeScreen api's
export const GET_UNFINISHED_DETAILS = BASE_URL + "user/get-percentages-all-section/"            // GET
export const GET_UPPER_DETAILS = BASE_URL + "user/all-test/"                 // GET

// logout api
export const LOGOUT = BASE_URL + "user/logout"

// subscription api
export const SUBSCRIPTION = BASE_URL + "user/Package-list/"
