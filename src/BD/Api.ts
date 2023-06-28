import axios from 'axios';
import Physician  from '../Models/Physician';

const link = 'https://hds-staging.toktokdoc.com/physicians?search='


 function getPhysicianList(search: string){
    return axios.get<Physician[]>(link + search);

}