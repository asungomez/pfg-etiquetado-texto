import './welcome.scss';

import {
  EuiHorizontalRule,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiSpacer,
  EuiSplitPanel,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import { CreateDatasetForm } from '../create_dataset/create_dataset_form';

export const Welcome: React.FC = () => {
  return (
    <EuiPageBody borderRadius="none" className="welcome">
      <EuiPageContent
        paddingSize="m"
        borderRadius="m"
        color="plain"
        hasShadow
        className="welcome__content"
      >
        <EuiPageContentBody className="welcome__content__body">
          <div>
            <EuiSplitPanel.Outer
              borderRadius="m"
              color="plain"
              hasShadow
              className="welcome__panel"
            >
              <EuiSplitPanel.Inner
                paddingSize="m"
                color="transparent"
                className="welcome__title"
              >
                <EuiText size="s" className="welcome__title-text">
                  ¡Bienvenido a Estimación Demográfica PFG!
                </EuiText>
                <EuiSpacer size="s" />
                <EuiTitle size="l">
                  <h1>Crea tu primer dataset</h1>
                </EuiTitle>
                <EuiSpacer size="s" />
                <EuiText size="s" color="subdued">
                  Un dataset es una lista de textos en alguno de los formatos
                  soportados. A partir de un dataset podrás crear informes.
                </EuiText>
                <EuiHorizontalRule size="full" margin="s" />
              </EuiSplitPanel.Inner>
              <EuiSplitPanel.Inner
                paddingSize="m"
                color="transparent"
                className="welcome__form"
              >
                <CreateDatasetForm />
              </EuiSplitPanel.Inner>
            </EuiSplitPanel.Outer>
          </div>
        </EuiPageContentBody>
      </EuiPageContent>
    </EuiPageBody>
  );
};
