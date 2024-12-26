sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	'sap/m/MessageToast',
	'sap/m/UploadCollectionParameter',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/ui/core/Fragment'
], function(Controller, MessageBox, MessageToast, UploadCollectionParameter, Dialog, Button, Fragment) {
	"use strict";

	return Controller.extend("zqueryres.controller.QueryResolutionDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf QueryResolution.ZQueryResolution.view.QueryResolutionDetail
		 */
		onInit: function() {
		//	this._UserID = sap.ushell.Container.getService("UserInfo").getId();
				this._UserID = "MSINGH13";

			/*	var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_QUERY_SRV/", true);
				this.getView().setModel(oModel);*/
				
			var oModelQ = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_QUERY_SRV/", true);
			this.getView().setModel(oModelQ);

			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
			this.getView().setModel(oModel);

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("QueryResolutionDetail").attachPatternMatched(this._onEditMatched, this);

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("queryresolutiondetail").attachPatternMatched(this._onPatternMatched, this);

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			var filters = [];
			filters.push(oUserID);
			var Pocount;
			var oAnswerQueryBtn = this.getView().byId("btnAnsQry");
			var OUploadButton = this.getView().byId("idupload");
			var txtPONOOB = this.getView().byId("objcmp");
			var Attachments = this.getView().byId("UploadCollection");

			oModelQ.read("/QueryToAnswerSet", {
				filters: filters,
				success: function(odata, oResponse) {
					Pocount = odata.results.length;
					if (Pocount > 0) {

						oAnswerQueryBtn.setVisible(true);
					} else {
						//	txtPONOOB.setTitle("");
						oAnswerQueryBtn.setVisible(false);
						Attachments.setUploadEnabled(false);
					}

				},
				error: function() {
					//	MessageBox.error("error");
				}
			});

			oModelQ.read("/QueryRaisedSet", {
				filters: filters,
				success: function(odata, oResponse) {
					Pocount = odata.results.length;
					if (Pocount > 0) {
						OUploadButton.setVisible(false);
						oAnswerQueryBtn.setVisible(false);
					} else {
						txtPONOOB.setTitle("");
						//	oAnswerQueryBtn.setVisible(false);
					}

				},
				error: function() {
					//	MessageBox.error("error");
				}
			});

		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		handleNavButtonPress: function(oEvent) {

			this.getRouter().navTo("FirstPage1", {}, true);
		},

		RefreshMasterList: function() {
			var oModelQ = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_QUERY_SRV/", true);

			var oSidPOList = this.getView().byId("idViewForPOList");
			var sid = oSidPOList.getText();
			var oList = sid + "--listToBeAns";
			var oList1 = sap.ui.getCore().byId(oList);
			//var oList1 = sap.ui.getCore().byId("__xmlview2--listToBeAns");
			//	var oList2 = sap.ui.getCore().byId("__xmlview1--listToBeAns");

			var filters = [];

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			filters.push(oUserID);
			var oModelData = new sap.ui.model.json.JSONModel();

			var POQueryHistory = this.getView().byId("tblQueryHistory");
			var oAnswerQueryBtn = this.getView().byId("btnAnsQry");

			var QueryId = this.getView().byId("idQuery");
			var PurchaseNo = this.getView().byId("PurOrdNo");
			var PODescription = this.getView().byId("PurOrdDesc");
			var POOrderInti = this.getView().byId("PurOrdInt");
			var txtCnDate = this.getView().byId("idCnDate");

			var vendor = this.getView().byId("PurOrdVendor");
			var DocType = this.getView().byId("PurDocType");

			var orderdate = this.getView().byId("PurOrdDt");
			var PoStatus = this.getView().byId("PurOrdSts");
			var oHtml = this.getView().byId("idFrame");
			var QueryAsked = this.getView().byId("tblQueryAsked");
			var tblQueryDateTime = this.getView().byId("tblQueryDateTime");
			var POPdf = this.getView().byId("idFramePO");

			var QueryAnswered = this.getView().byId("tblQueryanswered");
			var tblQueryAnswerDateTime = this.getView().byId("tblQueryansweredDateTime");
			var Attachments = this.getView().byId("UploadCollection");
			var attachmentTitle = this.getView().byId("attachmentTitle");
			var Pocount;
			var txtPONOOB = this.getView().byId("objcmp");
			oModelQ.read("/QueryToAnswerSet", {
				filters: filters,
				success: function(odata, oResponse) {
					//	Pocount = odata.results.length;
					if (oList1 !== undefined) {
						if (Pocount > 0) {
							oModelData.setData(odata);
							oList1.setModel(oModelData);
							oHtml.setVisible(true);
							POPdf.setVisible(true);

						} else {
							oModelData.setData(odata);
							oList1.setModel(oModelData);
							txtPONOOB.setTitle("");
							oHtml.setVisible(false);
							POPdf.setContent(null);
							POQueryHistory.setModel(null);
							QueryId.setText("");
							PurchaseNo.setText("");
							PODescription.setText("");
							POOrderInti.setText("");
							txtCnDate.setText("");
							vendor.setText("");
							DocType.setText("");
							orderdate.setText("");
							PoStatus.setText("");
							QueryAsked.setText("");
							tblQueryDateTime.setText("");
							QueryAnswered.setText("");
							tblQueryAnswerDateTime.setText("");
							Attachments.setUploadEnabled(false);
							attachmentTitle.setText("Uploaded(" + 0 + ") ");
							Attachments.setModel(null);

							oAnswerQueryBtn.setVisible(false);

						}

					}

				},
				error: function() {
					//	MessageBox.error("error");
				}

			});

		},

		_onEditMatched: function(oEvent) {

			var oParameters = oEvent.getParameters();
			var sObjectId = oEvent.getParameter("arguments").reviewData;
			var a = JSON.parse(sObjectId);
			var that = this;

			var txtQueryID = this.getView().byId("idQuery");
			var txtPONOOB = this.getView().byId("objcmp");
			var txtStatusectedTab = this.getView().byId("objcmp");
			var txtAnsQueryButton = this.getView().byId("btnAnsQry");
			var txtQueryst = this.getView().byId("QueryStatus");
			var Attachments = this.getView().byId("UploadCollection");
			var oSidPOList = this.getView().byId("idViewForPOList");
			var oQueryFromID = this.getView().byId("idQueryFromId");
			var oQueryFromIDforRaisedbyme = this.getView().byId("idQueryFromIdforRaisedbyme");

			if (oParameters.arguments.PurchaseOrderNo !== "" || oParameters.arguments.PurchaseOrderNo !== null) {

				this.PurchaseOrderNo = oParameters.arguments.PurchaseOrderNo;

				this.ListId = oParameters.arguments.oViewID;
				txtPONOOB.setTitle(this.PurchaseOrderNo);
				txtQueryID.setText(a.QueryID);
				txtPONOOB.setNumber(a.ToBeAns);
				txtQueryst.setText(a.QueryStatus);
				oSidPOList.setText(a.Sid);
				oQueryFromID.setText(a.QueryFromID);
				that.Type = a.POType;
				//	oQueryFromID.setText(a.UserID);

				that.handleIconTabBarSelect();

				if (txtStatusectedTab.getNumber() === "A") {
					txtAnsQueryButton.setVisible(true);
					Attachments.setUploadEnabled(true);

					//	txtAnsQueryButton.setEnabled(true);

				} else if (txtStatusectedTab.getNumber() === "R") {

					txtAnsQueryButton.setVisible(false);
					//	Attachments.setUploadEnabled(false);

				}

			} else {
				MessageBox.error("Incorrect Data");
			}
		},
		_onPatternMatched: function(oEvent) {

			var oParameters = oEvent.getParameters();
			var oModelQ = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_QUERY_SRV/", true);

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			var filters = [];
			filters.push(oUserID);
			var Pocount;
			var oAnswerQueryBtn = this.getView().byId("btnAnsQry");
			var POQueryHistory = this.getView().byId("tblQueryHistory");
			var PurchaseNo = this.getView().byId("PurOrdNo");
			var PODescription = this.getView().byId("PurOrdDesc");
			var POOrderInti = this.getView().byId("PurOrdInt");
			var txtCnDate = this.getView().byId("idCnDate");

			var vendor = this.getView().byId("PurOrdVendor");
			var DocType = this.getView().byId("PurDocType");

			var orderdate = this.getView().byId("PurOrdDt");
			var PoStatus = this.getView().byId("PurOrdSts");

			var PoNo = this.getView().byId("objcmp");
			var txtQueryID = this.getView().byId("idQuery");

			var QueryAsked = this.getView().byId("tblQueryAsked");
			var tblQueryDateTime = this.getView().byId("tblQueryDateTime");

			var QueryAnswered = this.getView().byId("tblQueryanswered");
			var tblQueryAnswerDateTime = this.getView().byId("tblQueryansweredDateTime");
			var Attachments = this.getView().byId("UploadCollection");
			var attachmentTitle = this.getView().byId("attachmentTitle");
			var POPdf = this.getView().byId("idFramePO");

			var oHtml = this.getView().byId("idFrame");
			var txtPONOOB = this.getView().byId("objcmp");

			var that = this;
			if (oParameters.arguments.status !== "" || oParameters.arguments.status !== null) {
				var POBlank = txtPONOOB.setTitle("");
				//	oAnswerQueryBtn.setVisible(false);
				oAnswerQueryBtn.setVisible(false);
				oHtml.setVisible(false);
				POPdf.setVisible(false);
				//	POCoverNote.setContent(null);
				POQueryHistory.setModel(null);
				PoNo.setTitle("");
				txtQueryID.setText("");
				PurchaseNo.setText("");
				PODescription.setText("");
				POOrderInti.setText("");
				txtCnDate.setText("");
				vendor.setText("");
				DocType.setText("");
				orderdate.setText("");
				PoStatus.setText("");
				QueryAsked.setText("");
				tblQueryDateTime.setText("");
				QueryAnswered.setText("");
				tblQueryAnswerDateTime.setText("");
				Attachments.setUploadEnabled(false);
				Attachments.setModel(null);
				attachmentTitle.setText("Uploaded(" + 0 + ") ");
			}
			/*	oModelQ.read("/QueryToAnswerSet", {
					filters: filters,
					success: function (odata, oResponse) {
						Pocount = odata.results.length;
						if (Pocount > 0) {
							//	that.handleIconTabBarSelect();
							//	oAnswerQueryBtn.setVisible(true);
						} else {
							//	oAnswerQueryBtn.setVisible(false);
							oAnswerQueryBtn.setVisible(false);
							oHtml.setVisible(false);
							POPdf.setVisible(false);
							//	POCoverNote.setContent(null);
							POQueryHistory.setModel(null);
							PoNo.setTitle("");
							txtQueryID.setText("");
							PurchaseNo.setText("");
							PODescription.setText("");
							POOrderInti.setText("");
							vendor.setText("");
							DocType.setText("");
							orderdate.setText("");
							PoStatus.setText("");
							QueryAsked.setText("");
							tblQueryDateTime.setText("");
							QueryAnswered.setText("");
							tblQueryAnswerDateTime.setText("");
							Attachments.setUploadEnabled(false);

						}

					},
					error: function () {
						//	MessageBox.error("error");
					}
				});

				oModelQ.read("/QueryRaisedSet", {
					filters: filters,
					success: function (odata, oResponse) {
						Pocount = odata.results.length;
						if (Pocount > 0) {
							that.handleIconTabBarSelect();
						} else {
							oAnswerQueryBtn.setVisible(false);
							//	POCoverNote.setContent(null);
							oHtml.setVisible(false);
							POPdf.setVisible(false);
							POQueryHistory.setModel(null);
							PoNo.setTitle("");
							txtQueryID.setText("");
							PurchaseNo.setText("");
							PODescription.setText("");
							POOrderInti.setText("");
							vendor.setText("");
							DocType.setText("");
							orderdate.setText("");
							PoStatus.setText("");
							QueryAsked.setText("");
							tblQueryDateTime.setText("");
							QueryAnswered.setText("");
							tblQueryAnswerDateTime.setText("");
							Attachments.setModel(null);
							Attachments.setUploadEnabled(false);
							attachmentTitle.setText("Uploaded(" + 0 + ") ");

						}

					},
					error: function () {
						//	MessageBox.error("error");
					}
				});*/

		},

		onUploadComplete: function(oEvent) {
			var that = this;
			that.OnPressAttachments();
		},

		// Before Upload Attachments
		onBeforeUploadStarts: function(oEvent) {

			var Attachments = this.getView().byId("UploadCollection");

			var PO = this.getView().byId("objcmp").getTitle();
			// Header Slug

			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

			var oCustomerHeaderPONo = new sap.m.UploadCollectionParameter({
				name: "PO_NO",
				value: PO
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderPONo);
			
			var oCustomerHeaderPONo1 = new sap.m.UploadCollectionParameter({
				name: "PONO",
				value: PO
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderPONo1);

			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;

			var sToken = oHeaders['x-csrf-token'];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);
			Attachments.setBusy(true);

		},
     
		onFilenameLengthExceed: function(oEvent) {
			var smsg = "Filename Length should be less than 35 characters";
			MessageBox.confirm(smsg, {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirm",
				actions: [sap.m.MessageBox.Action.OK],
				onClose: function(sAction) {
					if (sAction === "OK") {}
				}
			});
		},

		onUploadTerminated: function(oEvent) {
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
		},

		//Delete Attachment
		onFileDeleted: function(oEvent) {

			var documnentId = oEvent.getParameter("documentId");
			this.deleteItemById(documnentId);
		},

		deleteItemById: function(sItemToDeleteId) {

			var that = this;
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);

			var oPONo = this.getView().byId("objcmp").getTitle();

			oModel.setHeaders({
				"X-Requested-With": "X",
				"DocumentID": sItemToDeleteId
			});

			oModel.remove("/POAttachmentsSet('" + oPONo + "')", {

				method: "DELETE",
				success: function(odata, oResponse) {
					MessageBox.success("Attachment Deleted Successfully", {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						onClose: function(oAction) {
							that.OnPressAttachments();
						}
					});

				},

				error: function(err) {
					MessageBox.error("error");
				}
			});

			//	this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},
		getAttachmentTitleText: function() {

			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		SelectDialogPressAnswer: function(oEvent) {
			var oModelQ = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_QUERY_SRV/", true);

			if (!this._AnsweroDialog) {
				this._AnsweroDialog = sap.ui.xmlfragment("zqueryres.fragments.AnswerQuery", this);
				this._AnsweroDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._AnsweroDialog);
			this._AnsweroDialog.open();

			var lblOtp = sap.ui.getCore().byId("lblotp");
			var txtOtp = sap.ui.getCore().byId("idOTP");
			var genericUser = sap.ui.getCore().byId("txtgenericuser");
			var oModel = this.getView().getModel();
			oModel.read("/CheckGenericUserSet(UserID='" + this._UserID + "')", {
				success: function(odata, oResponse) {
					if (odata.Generic === "X") {
						genericUser.setText(odata.Generic);
						lblOtp.setVisible(true);
						txtOtp.setVisible(true);

					} else {
						lblOtp.setVisible(false);
						txtOtp.setVisible(false);
					}

				},
				error: function(oError) {
					//	MessageBox.error("Error : " + oError);
				}

			});

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			//	var oListAlRaised = this.getView().byId("listAlrdRaised");
			var filters = [];
			filters.push(oUserID);

			var txtQuery = sap.ui.getCore().byId("iQuery").setEnabled(false);
			var txtUser = sap.ui.getCore().byId("iUser").setEnabled(false);
			var txtDateTime = sap.ui.getCore().byId("idDateTime").setEnabled(false);
			var txtDate = sap.ui.getCore().byId("lblDate");
			var txtTime = sap.ui.getCore().byId("lblTime");
			var oPoNo = this.getView().byId("objcmp").getTitle();
			var oQueryId = this.getView().byId("idQuery").getText();
			var oQueryTo = sap.ui.getCore().byId("IdQueryTo");

			var DateTime;

			oModelQ.read("/QueryToAnswerSet", {
				filters: filters,
				success: function(odata, oResponse) {
					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(odata);
					for (var i = 0; i < oModelData.getData().results.length; i++) {
						if (oModelData.getData().results[i].QueryID.toString() === oQueryId) {
							txtQuery.setValue(oModelData.getData().results[i].Query);
							txtUser.setValue(oModelData.getData().results[i].QueryFrom);
							txtDate.setText(oModelData.getData().results[i].QueryDate);
							txtTime.setText(oModelData.getData().results[i].QueryTime);
							oQueryTo.setText(oModelData.getData().results[i].QueryFromID);
							DateTime = txtDate.getText() + "," + txtTime.getText();
							txtDateTime.setValue(DateTime);
						}
					}
				},
				error: function() {
					//	MessageBox.error("error");
				}
			});

			var TitleAnswer = oQueryId + " - Answer Query";

			var oTitle = this._AnsweroDialog.setTitle(TitleAnswer);

		},
		_GetCuurentDate: function(CurrDate) {
			var currentDate = new Date();
			var day = currentDate.getDate();
			var month = currentDate.getMonth() + 1;
			var year = currentDate.getFullYear();
			if (day < 10) {
				day = "0" + parseInt(currentDate.getDate());
			}
			if (month < 10) {
				month = "0" + parseInt(currentDate.getMonth() + 1);
			}
			CurrDate = day + "-" + month + "-" + year;
			//	CurrDate = day + "-" + month + "-" + year;
			return CurrDate;
		},
		GetClock24hrs: function() {

			var result = "";
			var d = new Date();
			var nhour = d.getHours(),
				nmin = d.getMinutes(),
				nsec = d.getSeconds();
			if (nhour === 0) {
				nhour = nhour;
			} else if (nhour >= 24) {
				nhour = nhour - 24;
			}

			if (nhour <= 9) {
				nhour = "0" + nhour;
			}
			if (nmin <= 9) {
				nmin = "0" + nmin;
			}
			if (nsec <= 9) {
				nsec = "0" + nsec;
			}
			result = nhour + ":" + nmin + ":" + nsec;
			return result;

		},

		OnSubmitAnswer: function(oEvent) {

			var oModel = this.getView().getModel();

			var oModelQ = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_QUERY_SRV/", true);

			var that = this;
			var QueryID = this.getView().byId("idQuery").getText();
			var PO = this.getView().byId("objcmp").getTitle();

			var QueryAns = sap.ui.getCore().byId("iQueryAns");
			var QueryFrom = sap.ui.getCore().byId("iUser");
			var Query = sap.ui.getCore().byId("iUser");

			var QueryTo = sap.ui.getCore().byId("IdQueryTo");

			if (QueryAns.getValue() === "") {
				MessageToast.show(" Please Answer Query ");
				return false;
			} else {

				var oItems = {};

				oItems.QueryID = QueryID;
				oItems.QueryFromID = this._UserID;
				oItems.QueryToID = QueryTo.getText();
				oItems.QueryDate = that._GetCuurentDate();
				oItems.QueryTime = that.GetClock24hrs();
				oItems.Query = QueryAns.getValue();
				oItems.PO_NO = PO;

				var genericUser = sap.ui.getCore().byId("txtgenericuser").getText();
				var txtOTP = sap.ui.getCore().byId("idOTP").getValue();
				if (genericUser === "X") {
					oModelQ.read("/CheckQueryOTPSet(PO_NO='" + PO + "',QUERY_ID='" + QueryID + "',QUERY_FROM_ID='" + QueryTo.getText() +
						"',QUERY_TO_ID='" + this._UserID + "',QUERY_OTP='" + txtOTP + "')", {
							success: function(odata, oResponse) {
								if (odata.VALID === "") {
									MessageBox.error("This OTP is not valid");
									return;
								} else {
									oModelQ.create("/AnswerQuerySet", oItems, {

										success: function(odata, oResponse) {

											var smsg = "Query for PO " + PO + " has been Answered";
											that.OnCancelAnswer();
											MessageBox.confirm(smsg, {
												icon: sap.m.MessageBox.Icon.INFORMATION,
												title: "Confirm",
												actions: [sap.m.MessageBox.Action.OK],
												onClose: function(sAction) {
													if (sAction === "OK") {

														//	that.RefreshQueryHistoryTable();
														that.RefreshMasterList();

													}
												}
											});

										},
										error: function(oError) {
											//	MessageBox.error("Error : " + oError);
										}

									});
								}

							},
							error: function(oError) {
								//	MessageBox.error("Error : " + oError);
							}

						});
				} else {
					oModelQ.create("/AnswerQuerySet", oItems, {

						success: function(odata, oResponse) {

							var smsg = "Query for PO " + PO + " has been Answered";
							that.OnCancelAnswer();
							MessageBox.confirm(smsg, {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: "Confirm",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(sAction) {
									if (sAction === "OK") {

										//	that.RefreshQueryHistoryTable();
										that.RefreshMasterList();

									}
								}
							});

						},
						error: function(oError) {
							//	MessageBox.error("Error : " + oError);
						}

					});
				}

			}

		},

		OnCancelAnswer: function(oEvent) {
			this._AnsweroDialog.close();
			if (this._AnsweroDialog) {
				this._AnsweroDialog.destroy();
				this._AnsweroDialog = null; // make it falsy so that it can be created next time
			}
		},

		handleIconTabBarSelect: function() {

			var that = this;
			var iconTab = this.getView().byId("idIconTabBarNoIconsD");
			if (iconTab.getSelectedKey() === "QueryDetails") {
				that.OnPressQueryDetails();
			} else if (iconTab.getSelectedKey() === "CoverNote") {
				that.OnPressCoverNote();
			} else if (iconTab.getSelectedKey() === "PurchseOrderNote") {
				that.OnPressPOPdf();

			} else if (iconTab.getSelectedKey() === "Attachments") {
				that.OnPressAttachments();

			} else if (iconTab.getSelectedKey() === "POQueries") {
				that.OnPressQueryHistory();
			} else if (iconTab.getSelectedKey() === "General") {
				that.OnPressGeneralTab();
			}

		},
		OnPressQueryDetails: function() {

			var oModelQ = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_QUERY_SRV/", true);

			var PONo = this.getView().byId("objcmp").getTitle();

			var OUserId = this._UserID;

			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
			filters.push(oPOH);
			var txtQueryID = this.getView().byId("idQuery");
			var tblQueryDetails = this.getView().byId("tblQueryDetails");
			var QueryAsked = this.getView().byId("tblQueryAsked");
			var QueryAskedDate = this.getView().byId("tblQueryDate");
			var tblQueryTime = this.getView().byId("tblQueryTime");
			var tblQueryDateTime = this.getView().byId("tblQueryDateTime");

			var QueryAnswered = this.getView().byId("tblQueryanswered");
			var QueryAnswerDate = this.getView().byId("tblQueryanswerDate");
			var tblQueryAnswerTime = this.getView().byId("tblQueryanswerTime");
			var tblQueryAnswerDateTime = this.getView().byId("tblQueryansweredDateTime");
			oModelQ.read("/QueryRaisedDetailsSet('" + txtQueryID.getText() + "')", {

				success: function(odata, oResponse) {
					QueryAsked.setText(odata.QueryAsked);
					QueryAskedDate.setText(odata.QueryAskedDate);
					tblQueryTime.setText(odata.QueryAskedTime);
					var QueryDateTime = QueryAskedDate.getText() + " " + tblQueryTime.getText();
					tblQueryDateTime.setText(QueryDateTime);

					QueryAnswered.setText(odata.QueryAnswered);
					QueryAnswerDate.setText(odata.QueryAnsweredDate);
					tblQueryAnswerTime.setText(odata.QueryAnsweredTime);
					var AnswerDateTime = QueryAnswerDate.getText() + " " + tblQueryAnswerTime.getText();
					tblQueryAnswerDateTime.setText(AnswerDateTime);

				},
				error: function() {
					//	MessageBox.error("error");
				}
			});

		},
		OnPressCoverNote: function() {
	var that = this;
			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var oHtml = this.getView().byId("idFrame");
			oHtml.setVisible(true);
			
				if (this.Type === "CHANGE") {
				this.POType = "CH";
			} else {
				this.POType = "PO";
			}
			
			if (this.Type === "CHANGE") {
				var sRead = "/CoverNotePdfSet('" + PONo + "')/$value";
			} else {
				var sRead = "/SelectedPOContentSet(PoNo='" + PONo + "',CnPo='" + 'CN' + "')/$value";
			}
		//	var sRead = "/SelectedPOContentSet(PoNo='" + PONo + "')/$value";

			oModel.read(sRead, {

				success: function(oData, oResponse) {
					if (oResponse.body !== "") {
						var pdfURL = oResponse.requestUri;
						oHtml.setContent("<iframe src=" + pdfURL + " width='100%' height='600px'></iframe>");
						oHtml.setVisible(true);
					} else {
							oHtml.setContent(null);
						MessageBox.error("Cover Note Read Failed");
					}

				},
				error: function() {
					//	MessageBox.error("Cover Note Read Failed");
				}
			});
		},
		OnPressPOPdf: function() {

			//	var oModel = this.getView().getModel();
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);

			var PONo = this.getView().byId("objcmp").getTitle();
			var oHtml = this.getView().byId("idFramePO");
			//	oHtml.setVisible(true);
			if (this.Type === "CHANGE") {
				this.POType = "CH";
			} else {
				this.POType = "PO";
			}
				var sRead = "/POPdfSet(PO_NO='" + PONo + "',CN_PO='" + this.POType + "')/$value";
		//	var sRead = "/POPdfSet('" + PONo + "')/$value";
			//	oModel.defaultHttpClient.enableJsonpCallback = true;
			oModel.read(sRead, {
				success: function(odata, oResponse) {
					if (oResponse.body !== "") {
						var pdfURL = oResponse.requestUri;
						oHtml.setContent("<iframe src=" + pdfURL + " width='100%' height='600px'></iframe>");
						//	oHtml.setVisible(true);

					} else {
						oHtml.setVisible(false);
					}
				},
				error: function() {
					oHtml.setContent(null);
						MessageBox.error("Purchase Order/Amendment pdf Read Failed");
				}
			});
		},
		OnPressAttachments: function() {

			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var that = this;
			var Attachments = this.getView().byId("UploadCollection");
			var OUserId = this._UserID;
			var oText, oDocumentDate, day, month, year, Hours, Minutes, Seconds, final;
			var attachmentTitle = this.getView().byId("attachmentTitle");
			var txtQueryst = this.getView().byId("QueryStatus");
			var txtPONOOB = this.getView().byId("objcmp");

			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
			filters.push(oPOH);
			Attachments.setBusy(true);

			if (PONo !== "") {
				oModel.read("/POAttachmentsSet", {
					filters: filters,
					success: function(odata, oResponse) {
						var oModelData = new sap.ui.model.json.JSONModel();
						oModelData.setData(odata);
						Attachments.setModel(oModelData);
						Attachments.setBusy(false);

						if (Attachments.getItems().length > 0) {
							for (var i = 0; i < Attachments.getItems().length; i++) {
								if (txtQueryst.getText() === "C") {
									Attachments.getItems()[i].setEnableDelete(false);
									Attachments.setUploadEnabled(false);

								} else if (txtQueryst.getText() === "O") {
									Attachments.setUploadEnabled(true);
									if (Attachments.getItems()[i].getAttributes()[0].getTitle() === OUserId) {
										if (txtPONOOB.getNumber() === "A") {
											Attachments.getItems()[i].setEnableDelete(true);

										} else if (txtPONOOB.getNumber() === "R") {

											Attachments.getItems()[i].setEnableDelete(false);
										}
										//	Attachments.getItems()[i].setEnableDelete(true);
									} else {
										Attachments.getItems()[i].setEnableDelete(false);
									}
								}

								// Attachments.getItems()[i].getStatuses()[0].getText();
								oText = Attachments.getItems()[i].getStatuses()[0].getText().substring(0, 13);
								year = Attachments.getItems()[i].getStatuses()[0].getText().substring(13, 17);
								month = Attachments.getItems()[i].getStatuses()[0].getText().substring(17, 19);
								day = Attachments.getItems()[i].getStatuses()[0].getText().substring(19, 21);

								Hours = Attachments.getItems()[i].getStatuses()[0].getText().substring(21, 24);
								Minutes = Attachments.getItems()[i].getStatuses()[0].getText().substring(24, 26);
								Seconds = Attachments.getItems()[i].getStatuses()[0].getText().substring(26, 28);

								final = oText + day + "-" + month + "-" + year + " " + Hours + ":" + Minutes + ":" + Seconds;
								Attachments.getItems()[i].getStatuses()[0].setText(final);
							}
						}
						attachmentTitle.setText(that.getAttachmentTitleText());

					},
					error: function() {
						//	MessageBox.error("error");
					}
				});
			} else {
				Attachments.setModel(null);
				Attachments.setBusy(false);
				Attachments.setUploadEnabled(false);
				attachmentTitle.setText("Uploaded(" + 0 + ") ");
			}
		},
		OnPressQueryHistory: function() {
			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var oTableHistory = this.getView().byId("tblQueryHistory");
			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
			filters.push(oPOH);

			oModel.read("/POQueryHistorySet", {
				filters: filters,
				success: function(odata, oResponse) {

					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(odata);
					oTableHistory.setModel(oModelData);

				},
				error: function() {
					//	MessageBox.error("error");
				}
			});

		},

		OnPressGeneralTab: function() {

			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();

			var oApproveButton = this.getView().byId("btnApprove");
			var oApproveReject = this.getView().byId("btnReject");

			var txtPurOrdNo = this.getView().byId("PurOrdNo");
			var txtQueryID = this.getView().byId("idQuery");
			var txtPODesc = this.getView().byId("PurOrdDesc");
			var txtPurOrdInt = this.getView().byId("PurOrdInt");
			var txtCnDate = this.getView().byId("idCnDate");
			var txtPurOrdVendor = this.getView().byId("PurOrdVendor");
			var txtPurOrdDocType = this.getView().byId("PurDocType");
			var txtPurOrdDt = this.getView().byId("PurOrdDt");
			var txtPurOrdSts = this.getView().byId("PurOrdSts");
			var oQueryFromID = this.getView().byId("idQueryFromId");

			var DocumentDate, day, month, year, final;

			oModel.read("/PurchaseOrderGeneralSet(PO_NO='" + PONo + "',UserID='" + oQueryFromID.getText() + "')", {
				success: function(odata, oResponse) {

					txtPurOrdNo.setText(oResponse.data.PO_NO);
					txtPODesc.setText(oResponse.data.PO_Description);
					txtPurOrdInt.setText(oResponse.data.PO_Initiator);
					txtPurOrdVendor.setText(oResponse.data.Vendor);
					//	txtPlant.setText(oResponse.data.Plant);
					txtPurOrdDocType.setText(oResponse.data.Document_Type);
					if (oResponse.data.Document_Date !== null) {
						DocumentDate = oResponse.data.Document_Date;
						year = DocumentDate.substring(0, 4);
						month = DocumentDate.substring(4, 6);
						day = DocumentDate.substring(6, 8);

						final = day + "-" + month + "-" + year;
						txtPurOrdDt.setText(final);

					} else {
						txtPurOrdDt.setText("");
					}
					if (odata.CN_Date !== null) {
						var CNDate = odata.CN_Date;
						year = CNDate.substring(0, 4);
						month = CNDate.substring(4, 6);
						day = CNDate.substring(6, 8);

						final = day + "-" + month + "-" + year;
						txtCnDate.setText(final);

					} else {
						txtCnDate.setText("");
					}

					txtPurOrdSts.setText(oResponse.data.PO_Status);

				},

				error: function(e) {
					//	MessageBox.error("error");
				}

			});
		}

	});

});