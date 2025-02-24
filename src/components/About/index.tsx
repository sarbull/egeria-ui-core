import React from "react";
import { Accordion, LoadingOverlay, Paper, Text } from '@mantine/core';
import { capitalize } from "@lfai/egeria-js-commons";
import { apiUrl } from '@lfai/egeria-js-commons';

interface Props {
}

interface State {
  loaded: boolean,
  error: boolean,
  data: {
    name: string,
    version: string,
    commitId: string,
    buildTime: string
  }
}

/**
 *
 * React component used for displaying details about the application instance.
 *
 * @since      0.1.0
 * @access     public
 *
 */
class EgeriaAbout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loaded: false,
      error: false,
      data: {
        name: '',
        version: '',
        commitId: '',
        buildTime: ''
      }
    };
  }

  componentDidMount() {
    fetch(`${apiUrl() || ''}/about.json`)
      .then((response: any) => {
        if(!response.ok) {
          this.setState({
            loaded: true,
            error: true
          });

          const event = new CustomEvent('EGERIA_API_ERROR', {
            'detail': {
              status: response.status,
              statusText: response.statusText
            }
          });

          document.dispatchEvent(event);
        }

        return response;
      })
      .then((data: any) => {
        return data.json();
      })
      .then(data => {
        this.setState({
          loaded: true,
          data: {
            ...data
          }
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  render() {
    const { loaded, error, data }: any = this.state;

    return (<>
      <div style={{ height:'100%', position: 'relative' }}>
        <LoadingOverlay visible={!loaded} />

        { !error && loaded && <Paper shadow="xs" p="md" style={{height: '100%'}}>
          <Text size="xl">About</Text>
            <Accordion>
              { Object.keys(data).filter(k => k !== 'loaded').map((k, index) => {
                return (
                  <Accordion.Item value={k} key={index}>
                    <Accordion.Control>{ capitalize(k) }</Accordion.Control>
                    <Accordion.Panel>{ capitalize(data[k]) }</Accordion.Panel>
                  </Accordion.Item>
                );
              }) }
            </Accordion>
        </Paper> }
      </div>
    </>);
  }
}

export {
  EgeriaAbout
};