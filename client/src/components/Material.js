import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Upload from './Upload';
import FileList from './FileList'; 
import '../css/Material.css';

const Material = () => {
  return (
    <div className="material-main-div">
      <Tabs>
        <TabList>
          <Tab>Upload</Tab>
          <Tab>Files</Tab>
        </TabList>

        <TabPanel>
            <Upload/>
        </TabPanel>
        <TabPanel>
            <FileList/>
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default Material
