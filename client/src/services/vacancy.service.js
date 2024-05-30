import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "http://localhost:8080/api/test/"

class VacancyService {
    
    createVac(newVacData) {
        const createUrl = `${API_URL}vacancies`; 
    
        return axios.post(createUrl, newVacData, { headers: authHeader() })
          .then((response) => {
            const createdAgr = response.data;
            return createdAgr;
          })
          .catch((error) => {
            throw error;
          });
    };

    showVac() {
        const showUrl = `${API_URL}vacancies`;

        return axios.get()
    }
}

export default new VacancyService();