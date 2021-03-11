import router from 'umi/router';
import routerRedux from 'umi/router';

function Component() {
  routerRedux.push('/home');
  router.push('home');
}

export default Component;
