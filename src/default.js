import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import NavLink from 'umi/navlink';
import dynamic from 'umi/dynamic';
import Redirect from 'umi/redirect';

const Dy = dynamic({});

function Component() {
  return (
    <>
      <NavLink />
      <Link />
      <Redirect />
    </>
  );
}

export default withRouter(Component);
