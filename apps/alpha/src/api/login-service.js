import { getAction, postAction } from '../utils/http';

const getValidImage = (config) => {
  return getAction('/api/netres-service/user/getImage', undefined, config);
};

const loginService = (params) => {
  return postAction('/api/netres-service/user/login', params);
};
const verifyToken = () => {
  return getAction(`/api/netres-service/user/verify`);
};
export { getValidImage, loginService, verifyToken };
