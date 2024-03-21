import { AxiosService } from "./axios.service";


describe('Axios Service', () => {
  const target = new URL('http://intranet-ipc.esi.adp.com');
  jest.setTimeout(30000);

  it('should return 200', async () => {
    const a = new AxiosService(undefined, 30000);
    const res = await a.request({
      url: target.toString()
    });

    expect(res.response).toBeDefined();
    expect(res.response?.status).toBe(200);
  });

  it('should return 200 also', async () => {
    const a = new AxiosService(undefined, 30000);
    const res = await a.request({
      url: 'https://google.com',
      proxy: false,
      
    });

    expect(res.response).toBeDefined();
    expect(res.response?.status).toBe(200);
  });

  it('should timeout', async () => {
    const a = new AxiosService(undefined, 1);
    const res = await a.request({
      url: target.toString()
    });

    expect(res.response).toBeUndefined();
    expect(res.error).toBeDefined();
    expect(res.timedout).toBeTruthy();
  });
});
