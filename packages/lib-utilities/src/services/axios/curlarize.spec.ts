import { AxiosRequestConfig } from "axios";
import axios from 'axios';
import { CurlHelper } from "./curlarize";

describe('curlarize', () => {


  it('should be defined', () => {
    const cfg: AxiosRequestConfig = {
      url: 'http://test.com/bla',
      headers: {
        'Accept': 'test'
      },
      params: { bla: 'bla'}
    };

    const a = axios.create(cfg);
    const c = new CurlHelper(
      a,
      cfg
    );

    const com = c.generateCommand();

    console.log(com);
    expect(c).toBeDefined();
  })
});