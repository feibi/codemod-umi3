import {useSelector, useDispatch, useLocation, useParams} from 'dva';
import {Helmet} from 'react-helmet';
import {formatMessage, FormattedMessage} from 'umi-plugin-locale';
import {injectIntl} from 'react-intl';
import {ConnectedProps} from 'react-redux';
import {delay} from 'redux-saga';

function B() {
  const store = useSelector((s) => s);
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const f = formatMessage({id: 'trade.process.name'});
  return (
    <span className="ant-modal-title-subtitle">
      <Helmet>
        <title>tt</title>
      </Helmet>
      <FormattedMessage id="trade.process.update.subTitle" />
    </span>
  );
}

export default injectIntl(B);
