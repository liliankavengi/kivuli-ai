import API from "../../services/api";

export const loginBusiness = async (businessId, password) => {
  // Example for future deployment
  // const res = await API.post("/auth/login/", { businessId, password });
  // return res.data;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ token: "mock-jwt-token", businessId });
    }, 500);
  });
};
