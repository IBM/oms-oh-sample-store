# OMS - Order Hub Sample Store

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.3.

Use this repository to set up a sample store within Order Hub, load a sample catalog, and view the estimated delivery date on product landing pages and product display pages.

## Main setup

1. Setup your development environment by installing the latest version of [Node.js](https://nodejs.org/en/download/releases/) LTS 10.x series. If multiple node versions are required, it is recommended that you use [nvm](https://github.com/nvm-sh/nvm) (for Mac or Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (for Windows).
2. Install [Git](https://git-scm.com/).
3. Install [Yarn](https://yarnpkg.com/en/docs/install).
4. Preferably complete: [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh)
5. Install Angular CLI 8.3.3 globally: `npm install -g @angular/cli@8.3.3`
6. Clone oms-oh-sample-store git repository: `git clone git@github.ibm.com:WCI/oms-oh-sample-store.git`: 
7. Install all dependencies by using Yarn: `yarn install`
    * To clear yarn cache, use: `yarn cache clean`
    * To ignore cache and add any dependency, use: `yarn add <any dependency name> --force`

## (For local development only) Mapping localhost to bucgenerichost

To enable local development, Order Hub enables requests to come from `bucgenerichost`. The `localhost` needs to be mapped to this host name so that local angular development server can contact Order Hub. This will need to be done by every developer.
1. Locate the `hosts` file on your machine (admin or root/sudo access required):
    * Windows 10: `C:\Windows\System32\drivers\etc\hosts`
    * Linux: `/etc/hosts`
    * Mac: `/etc/hosts`
2. Add the new hostname after existing entries for localhost: `127.0.0.1 localhost bucgenerichost` and save.

The `package.json` has `--host=bucgenerichost` entry in the `start` script to enable the local angular server to start with hostname as `bucgenerichost`.

## (For local development only) Starting the angular server

`yarn start`: This will start the local development server over HTTPS at: `https://bucgenerichost:9000/oms-oh-sample-store`.

* Since this angular HTTPS server does not have a valid certificate, on every server start, you cannot immediately view the sample store in Order Hub. You need to accept a temporary certificate.
    1. Open the URL `https://bucgenerichost:9000/oms-oh-sample-store` in a new tab and accept the certificate error. By accepting the certificate, you create a browser exception for the session. After you accept the certificate, you will simply see a blank page. The application is designed to be rendered inside Order Hub only as it provides user authentication, authorization and other security features.

* **NOTE**:This certificate issue does not occur after you upload your build artifacts to IBM and configure Order Hub to connect to the artifacts that are hosted by IBM instead of your local development environment.  For more information, see `Uploading build artifacts to Order Hub` below


## (For local development only) Adding sample store to the menu in Order Hub

Now, add menu items in Order Hub so that you can access the sample store. The generic steps are documented here https://www.ibm.com/support/knowledgecenter/SSGTJF/developing/custom_buc_customizing_add_new_features.html. Complete the steps to create the three menu items with the following information:

**Create 1 parent menu item as follows:**  
**Feature ID =** `custom-oms-oh-sample-store`  
**Custom feature name =** `Samples`  
Check both `Fulfilment manager` and `Tenant administrator` checkboxes  
**Path =** `/oms-oh-sample-store`  
Check `Local development environment` checkbox if doing local development  
**Local development environment URL =** `https://bucgenerichost:9000/oms-oh-sample-store`  
Check `Hosted by IBM` checkbox  
**Order Hub hosted relative URL =** `/oms-oh-sample-store/`  

**Create 1st child menu item as follows:**  
**Feature ID =** `custom-sample-store`  
**Custom feature name =** `Store`  
Check both `Fulfilment manager` and `Tenant administrator` checkboxes  
**Path =** `/oms-oh-sample-store`  
Check `Local development environment` checkbox if doing local development  
**Local development environment URL =** `https://bucgenerichost:9000/oms-oh-sample-store`  
Check `Hosted by IBM` checkbox  
**Order Hub hosted relative URL =** `/oms-oh-sample-store/`  

**Create 2nd child menu item as follows:**  
**Feature ID =** `custom-store-dataload`  
**Custom feature name =** `Dataload`  
Check `Tenant administrator` checkbox  
**Path =** `/oms-oh-sample-store/home/dataload`  
Check `Local development environment` checkbox if doing local development  
**Local development environment URL =** `https://bucgenerichost:9000/oms-oh-sample-store/home/dataload`  
Check `Hosted by IBM` checkbox  
**Order Hub hosted relative URL =** `/oms-oh-sample-store/home/dataload`  

## Uploading build artifacts to Order Hub

Follow the steps outlined here to deploy the changes into your Order Hub tenant environment:
https://www.ibm.com/support/knowledgecenter/SSGTJF/developing/custom_uploadtobuc.html  
Note: skip step 1 about defining the custom menus from the documentation link.

A short summary of the steps outlined in the documentation link above are:

### Mac or *nix
```
export APP_NAME=oms-oh-sample-store
export ORDER_HUB_HOSTNAME=https://app.omsbusinessusercontrols.ibm.com
export CUSTOMIZATION_CONTEXT_ROOT=<your tenant CUSTOMIZATION_CONTEXT_ROOT>
export CLIENT_ID=<your tenant CLIENT_ID>
export CLIENT_SECRET=<your tenant CLIENT_SECRET>

yarn build --source-map --base-href=$CUSTOMIZATION_CONTEXT_ROOT/$APP_NAME/ --deploy-url=$CUSTOMIZATION_CONTEXT_ROOT/$APP_NAME/
yarn run publishToOrderHub
```  

### Windows (Powershell)
```
$Env:APP_NAME="oms-oh-sample-store"
$Env:ORDER_HUB_HOSTNAME="https://app.omsbusinessusercontrols.ibm.com"
$Env:CUSTOMIZATION_CONTEXT_ROOT=<your tenant CUSTOMIZATION_CONTEXT_ROOT>
$Env:CLIENT_ID=<your tenant CLIENT_ID>
$Env:CLIENT_SECRET=<your tenant CLIENT_SECRET>

yarn build --source-map --base-href=$Env:CUSTOMIZATION_CONTEXT_ROOT/$Env:APP_NAME/ --deploy-url=$Env:CUSTOMIZATION_CONTEXT_ROOT/$Env:APP_NAME/
yarn run publishToOrderHub
```
Note: you can get the **CUSTOMIZATION_CONTEXT_ROOT**, **CLIENT_ID** and **CLIENT_SECRET** for your tenant from **Order Hub -> Settings -> Configurations -> Add ons -> Customization configuration**.

## Using the sample store

The sample store contains two pages: a sample product landing page (PLP) and product display page (PDP).
You should now see the new **Samples -> Store** and **Samples -> Dataload** menu items. Visiting the **Samples -> Store** menuitem should show a title **Order Hub Store** followed by a blank page. You must use the Dataload menu to load a JSON file with the information needed to render in the sample store.

A sample datalod JSON file is provided under /oms-oh-sample-store/src/assets/mock-data/products.json. It is mainly for you to provide the list of items from OMS that you want displayed in the store. The other fields in the JSON include:
- `OrganizationCode` identifies the catalog organization code for the items. 
- `ProductClass` and `UnitOfMeasure` are used to query IV and Promising APIs as needed
- `Currency` is used when retrieving prices from OMS. 
- `Symbol` is used to display prices. 
- `DistributionGroupId` and `DeliveryMethod` are used for querying the online inventory availability count in the PDP from IV. 
- `PostalCode` is used as the default postal code to query Promising in the PLP and PDP before the user enters a specific postal code on the PDP.

After uploading the JSON, you should be able to see the items shown in the store page if you go back to the **Samples -> Store** menu item.
