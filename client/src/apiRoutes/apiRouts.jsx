import axios from "axios";

const baseURL = "http://localhost:5002/";

export const userRequest = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor to include the Authorization header with the token
userRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// userRequest.interceptors.response.use(
//   (response) => {
//     console.log("response");
//     return response;
//   },
//   (error) => {
//     console.log("error in api routes ", error);
//     const is401 = error.message === "Request failed with status code 401";
//     const is500 = error.message === "Request failed with status code 500";
//     const isTooManyReq = error?.response?.status === 429;
//     if (isTooManyReq) {
//       notification.error({
//         message: "Too Many Request",
//         description:
//           "You have exceeded the limit. Please try again after 15 minutes.",
//         placement: "topRight",
//         className: "font-inter font-medium",
//         duration: 0,
//       });
//     } else if (is401 || is500) {
//       // Check for token expiration
//       // Redirect to the sign-out page
//       localStorage.removeItem("username");
//       localStorage.removeItem("token");
//       sessionStorage.clear();

//       // is401
//       //   ? toast.error("Session Expire Need to Signin Again")
//       //   : toast.error("Internal Server Error try later");

//       window.location.href = "https://ad.oee-tracker.com/signin/";
//     }
//     return Promise.reject(error);
//   }
// );
