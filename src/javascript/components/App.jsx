import React from 'react';

import Grid from 'react-bootstrap/lib/Grid'

import TopBar from './TopBar.jsx';
import { View } from '../models/AppState.jsx';
import PdfUploadView from './PdfUploadView.jsx';
import LoadingView from './LoadingView.jsx';
import PdfView from './PdfView.jsx';

export default class App extends React.Component {

    static propTypes = {
        appState: React.PropTypes.object.isRequired,
    };

    render() {
        // console.debug(this.props.appState);
        const appState = this.props.appState;

        var mainView;
        switch (this.props.appState.mainView) {
        case View.UPLOAD:
            mainView = <PdfUploadView uploadPdfFunction={ appState.storeFileBuffer } />
            break;
        case View.LOADING:
            mainView = <LoadingView fileBuffer={ appState.fileBuffer } storePdfPagesFunction={ appState.storePdfPages } />
            break;
        case View.PDF_VIEW:
            mainView = <PdfView pdfPages={ appState.pdfPages } transformations={ appState.transformations } />
            break;
        }

        return (
            <div>
              <TopBar/>
              <Grid>
                <div>
                  { mainView }
                </div>
              </Grid>
            </div>
            );
    }
}

