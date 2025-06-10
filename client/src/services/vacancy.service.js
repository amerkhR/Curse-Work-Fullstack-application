import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/vacancies/";

class VacancyService {
  getAll() {
    return axios.get(API_URL);
  }

  get(id) {
    return axios.get(API_URL + id);
  }

  getVacanciesByCompany(companyName) {
    return axios.get(API_URL + "company/" + encodeURIComponent(companyName));
  }

  updateCompanyDescription(companyName, description) {
    const encodedCompanyName = encodeURIComponent(companyName.trim());
    console.log("Encoded company name:", encodedCompanyName);

    return axios.put(
      API_URL + "company/" + encodedCompanyName + "/description",
      { description },
      {
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
        },
      }
    );
  }

  create(data) {
    return axios.post(API_URL, data);
  }

  update(id, data) {
    return axios.put(API_URL + id, data);
  }

  delete(id) {
    return axios.delete(API_URL + id);
  }
}

export default new VacancyService();
