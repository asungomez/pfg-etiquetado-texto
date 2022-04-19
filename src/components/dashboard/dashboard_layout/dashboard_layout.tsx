import { EuiPage } from '@elastic/eui';

import { DashboardRouter } from '../../../routers/dashboard_router';
import { Header } from './dashboard_layout_header';

export const DashboardLayout: React.FC<{}> = () => {
  return (
    <>
      <Header />
      <EuiPage paddingSize="m" grow>
        <DashboardRouter />
      </EuiPage>
    </>
  );
};
