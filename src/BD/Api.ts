import axios from 'axios';
import Physician  from '../Models/Physician';
const link = 'https://hds-staging.toktokdoc.com/physicians?search='

class BD {
    Physician: Physician[] = [];
    

constructor() {
    this.Physician = [];
}

async getPhysician(search: string) {
    try{
    const response = await axios.get(link + search);
    const data = response.data;
    this.Physician = data;
    return this.Physician;
    }
    catch(error){
        console.log(error);
    }
    return [];


}
}

export default BD;