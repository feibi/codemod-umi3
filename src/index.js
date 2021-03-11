import router from 'umi/router';
import routerRedux from 'umi/router';
import {injectIntl, FormattedMessage} from 'react-intl';
import {useSelector, useDispatch, useLocation, useParams} from 'dva';
import {Helmet} from 'react-helmet';
import {history} from 'umi';
import {formatMessage} from 'umi-plugin-locale';
import {ConnectedProps} from 'react-redux';

routerRedux.push('/');

function a() {
  routerRedux.push('/');
  const {search} = window.g_history.location;
  window.g_app._store.dispatch({
    type: `${SHORTCUT}/showRecommendHouse`,
    payload: data,
  });
}

function b() {
  const f = formatMessage({id: 'trade.process.name'});
  return (
    <span className="ant-modal-title-subtitle">
      <FormattedMessage id="trade.process.update.subTitle" />
    </span>
  );
}
