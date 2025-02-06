sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'zqueryres/utils/formatter'
], function(
	Controller,formatter
) {
	"use strict";

	return Controller.extend("zqueryres.controller.QueryResolutionMaster", {
		formatter: formatter,
		
	onInit: function() {

		var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_QUERY_SRV/", true);
		this.getView().setModel(oModel);
		//this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//this._oRouter.getRoute("QueryResolutionDetail").attachPatternMatched(this._onTabMatched, this);
		
		
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this._oRouter.getRoute("FirstPage1").attachPatternMatched(this._onEditMatched, this);

		this._UserID = sap.ushell.Container.getService("UserInfo").getId();
			//this._UserID = "MSINGH13";

		var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
		var oList = this.getView().byId("listToBeAns");
		var oListAlRaised = this.getView().byId("listAlrdRaised");
		var filters = [];
		filters.push(oUserID);
		var PoCountAnsToBe = this.getView().byId("idtextPocount");

		oModel.read("/QueryToAnswerSet", {
			filters: filters,
			success: function(odata, oResponse) {
				var Pocount = odata.results.length;
				PoCountAnsToBe.setText(Pocount);
				var oModelData = new sap.ui.model.json.JSONModel();
				oModelData.setData(odata);
				oList.setModel(oModelData);

			},
			error: function() {
				//	MessageBox.error("error");
			}
		});

		var PoCountalRaised = this.getView().byId("idtextPocountAlredyR");
		oModel.read("/QueryRaisedSet", {
			filters: filters,
			success: function(odata, oResponse) {
				var PocountAl = odata.results.length;
				PoCountalRaised.setText(PocountAl);
				var oModelData = new sap.ui.model.json.JSONModel();
				oModelData.setData(odata);
				oListAlRaised.setModel(oModelData);

			},
			error: function() {
				//	MessageBox.error("error");
			}
		});
	
		var oTabSelect = this.getView().byId("idIconTabBarNoIcons").setSelectedKey("ToBeAns");

		oList.attachUpdateFinished(function(oEvent) {

			var aItems = oEvent.getSource().getItems();
			if (aItems.length > 0) {
				oEvent.getSource().getItems()[0].setSelected(true);
				oEvent.getSource().getItems()[0].firePress();
			}
		});

	},

	onSelectionChange: function(e) {

		var oList = this.getView().byId("listPO");

		var PurchaseOrderNo = e.getParameters().listItem.getAttributes()[0].getText();
		var QueryId = e.getParameters().listItem.getTitle();
		var QueryStatus = e.getParameters().listItem.getSecondStatus().getText();
		var QueryFromID = e.getParameters().listItem.getFirstStatus().getText();
			var POType =e.getParameters().listItem.getAttributes()[3].getText();
		var Sid = this.getView().sId;
		var Querystatus = "";
		if (QueryStatus === "Closed") {
			Querystatus = "C";
		} else if (QueryStatus === "Open") {
			Querystatus = "O";
		}
		var itemN = {};
		itemN.QueryID = QueryId;
		itemN.ToBeAns = "A";
		itemN.QueryStatus = Querystatus;
		itemN.Sid = Sid;
		itemN.QueryFromID = QueryFromID;
		itemN.POType = POType;

		var itemR = {};
		itemR.QueryID = QueryId;
		itemR.ToBeAns = "R";
		itemR.QueryStatus = Querystatus;
		itemR.Sid = Sid;
		itemR.QueryFromID = this._UserID;
		itemR.POType = POType;

		var oTabSelect = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
		if (oTabSelect === "ToBeAns") {
			this.getRouter().navTo("QueryResolutionDetail", {
				PurchaseOrderNo: PurchaseOrderNo,
				reviewData: JSON.stringify(itemN)
			});

		} else if (oTabSelect === "AlrdRaised") {
			this.getRouter().navTo("QueryResolutionDetail", {
				PurchaseOrderNo: PurchaseOrderNo,
				reviewData: JSON.stringify(itemR)
			});

		}

		if (this._prevSelect) {
			this._prevSelect.$().css('background-color', '');

		}
		var item = e.getParameter('listItem');
		item.$().css('background-color', '#D3D3D3');

		this._prevSelect = item;

	},

	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	_onEditMatched: function(oEvent) {

			var oList = this.getView().byId("listToBeAns");
		var oListAlRaised = this.getView().byId("listAlrdRaised");
		
		oList.removeSelections(true);
		oListAlRaised.removeSelections(true);

	},
	onSearch: function(oEvent) {

		var sQuery = oEvent.getParameter("query");
		var oFilter = new sap.ui.model.Filter({
			// two filters
			filters: [
				new sap.ui.model.Filter("QueryID", sap.ui.model.FilterOperator.Contains, sQuery) // filter for value 1
			]
		});

		var oTabSelect = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
		if (oTabSelect === "ToBeAns") {
			var oBinding = this.byId("listToBeAns").getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		} else if (oTabSelect === "AlrdRaised") {
			var oBindingR = this.byId("listAlrdRaised").getBinding("items");
			oBindingR.filter(oFilter, sap.ui.model.FilterType.Application);
		}

	},

	onListItemPress: function(oEvent) {
	
		var oTabSelect = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
		var objEdit = oEvent.getSource().getBindingContext().getObject();
		var Querystatus = "";
		var Sid = this.getView().sId;
		if (objEdit.QueryStatusText === "Closed") {
			Querystatus = "C";
		} else if (objEdit.QueryStatusText === "Open") {
			Querystatus = "O";
		}

		var itemN = {};
		itemN.QueryID = objEdit.QueryID;
		itemN.ToBeAns = "A";
		itemN.QueryStatus = Querystatus;
		itemN.Sid = Sid;
		itemN.QueryFromID = objEdit.QueryFromID;
			itemN.POType = objEdit.PoType;

		var itemR = {};
		itemR.QueryID = objEdit.QueryID;
		itemR.ToBeAns = "R";
		itemR.QueryStatus = Querystatus;
		itemR.Sid = Sid;
		itemR.QueryFromID = this._UserID;
			itemR.POType = objEdit.PoType;

		//	QueryFromID

		if (oTabSelect === "ToBeAns") {

			this.getRouter().navTo("QueryResolutionDetail", {
				PurchaseOrderNo: objEdit.PO_NO,
				reviewData: JSON.stringify(itemN)
			});
		} else if (oTabSelect === "AlrdRaised") {
			this.getRouter().navTo("QueryResolutionDetail", {
				PurchaseOrderNo: objEdit.PO_NO,
				reviewData: JSON.stringify(itemR)
			});
		}

	},

	handleOpenDialog: function(oEvent) {

		var oButton = oEvent.getSource();
		if (!this._oDialogFilter) {
			this._oDialogFilter = sap.ui.xmlfragment("zqueryres.fragments.Filter", this);
			this._oDialogFilter.setModel(this.getView().getModel());
		}

		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogFilter);
		this._oDialogFilter.open();

	},

	OnSelectTab: function(oEvent) {

		var that = this;
		var oModel = this.getView().getModel();
		var sKey = oEvent.getParameter("key");
		var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
		var oListAnswer = this.getView().byId("listToBeAns");
		var oListRaised = this.getView().byId("listAlrdRaised");

		var filters = [];
		filters.push(oUserID);
		var Pocount;
		var oModelData = new sap.ui.model.json.JSONModel();
		var PoCountAnsToBe = this.getView().byId("idtextPocount");
		var status = "";

		if (sKey === "ToBeAns") {
			if (PoCountAnsToBe.getText() <= 0) {
				this.getRouter().navTo("queryresolutiondetail", {
					status: "T"
				});
			} else {
				oModel.read("/QueryToAnswerSet", {
					filters: filters,
					success: function(odata, oResponse) {

						oModelData.setData(odata);
						oListAnswer.setModel(oModelData);
						oListAnswer.getItems()[0].setSelected(true);
						oListAnswer.getItems()[0].firePress();

					},
					error: function() {
						//	MessageBox.error("error");
					}
				});
			}

		} else if (sKey === "AlrdRaised") {
			var PoCountalRaised = this.getView().byId("idtextPocountAlredyR");

			if (PoCountalRaised.getText() <= 0) {
				this.getRouter().navTo("queryresolutiondetail", {
					status: "A"
				});
			} else {
				oModel.read("/QueryRaisedSet", {
					filters: filters,
					success: function(odata, oResponse) {
						Pocount = odata.results.length;

						oModelData.setData(odata);
						oListRaised.setModel(oModelData);
						oListRaised.getItems()[0].setSelected(true);
						oListRaised.getItems()[0].firePress();

					},
					error: function() {
						//	MessageBox.error("error");
					}
				});
			}

		}

	},

	handleConfirm: function(oEvent) {
		var oModel = this.getView().getModel();
		var that = this;
		var query = oEvent.getSource().getSelectedFilterItems();
		var oList = this.byId("listToBeAns");
		var oListAlRaised = this.getView().byId("listAlrdRaised");
		var oBinding = oList.getBinding("items");
		var oBindingR = oListAlRaised.getBinding("items");
		var oTabSelect = this.getView().byId("idIconTabBarNoIcons").getSelectedKey();
		if (query.length > 0) {
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("QueryStatusText", sap.ui.model.FilterOperator.EQ, query[0].getText()), // filter for value 1
				]
			});
			if (oTabSelect === "ToBeAns") {
				oBinding.filter(oFilter);
			} else if (oTabSelect === "AlrdRaised") {
				oBindingR.filter(oFilter);

			} else {
				oBinding.filter([]);
			}

		}
	}


	});
});