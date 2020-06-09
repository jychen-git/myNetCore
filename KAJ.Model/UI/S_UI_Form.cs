using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Model.UI
{
    public partial class S_UI_Form
    {

        List<CalItem> _calculateItems = null;
        [NotMapped]
        [JsonIgnore]
        public List<CalItem> CalculateItems
        {
            get
            {
                if (_calculateItems == null)
                {
                    _calculateItems = new List<CalItem>();
                    var list = JsonHelper.ToList(this.CalItems);
                    foreach (var item in list)
                    {
                        var calItem = new CalItem();
                        calItem.Expression = item.GetValue("Expression");
                        calItem.FieldCode = item.GetValue("Code").Trim('{', '}');
                        calItem.TriggerFields = item.GetValue("TriggerFields");
                        calItem.CalDefaultValue = item.GetValue("CalDefaultValue");
                        calItem.CollectionValueField = item.GetValue("CollectionValueField");
                        calItem.DecimalPlaces = String.IsNullOrEmpty(item.GetValue("decimalPlaces")) ? 2 : Convert.ToInt32(item.GetValue("decimalPlaces"));
                        calItem.AutoTrigger = item.GetValue("TriggerMethod") == TriggerMethod.InputChange.ToString() ? true : false;
                        calItem.CalType = String.IsNullOrEmpty(item.GetValue("CalType")) ? CalType.Decimal.ToString() : item.GetValue("CalType");
                        if (!String.IsNullOrEmpty(item.GetValue("Details")))
                        {
                            var details = JsonHelper.ToList(item.GetValue("Details"));
                            foreach (var detail in details)
                            {
                                var adapter = new CalAdapterItem();
                                adapter.InputField = detail.GetValue("InputField");
                                adapter.NeedInputCode = detail.GetValue("NeedInputCode");
                                adapter.DefaultValue = detail.GetValue("DefaultValue");
                                calItem.AdapterItems.Add(adapter);
                            }
                        }
                        if (!String.IsNullOrEmpty(item.GetValue("Filter")))
                        {
                            var filters = JsonHelper.ToList(item.GetValue("Filter"));
                            foreach (var filter in filters)
                            {
                                var filterItem = new FilterItem();
                                filterItem.Field = filter.GetValue("Field");
                                filterItem.QueryMode = filter.GetValue("QueryMode");
                                filterItem.Value = filter.GetValue("Value");
                                filterItem.Group = filter.GetValue("Group");
                                calItem.Filters.Add(filterItem);
                            }
                        }
                        if (!String.IsNullOrEmpty(item.GetValue("ValueCondition")))
                        {
                            var valueConditionList = JsonHelper.ToList(item.GetValue("ValueCondition"));
                            foreach (var valueCondition in valueConditionList)
                            {
                                var valueItem = new ValueConditionItem();
                                valueItem.FieldCode = valueCondition.GetValue("FieldCode");
                                valueItem.QueryMode = valueCondition.GetValue("QueryMode");
                                valueItem.Value = valueCondition.GetValue("Value");
                                valueItem.ConditionValue = valueCondition.GetValue("ConditionValue");
                                calItem.ValueConditionItem.Add(valueItem);
                            }
                        }
                        if (!String.IsNullOrEmpty(item.GetValue("SubTableAdapter")))
                        {
                            var subTableAdps = JsonHelper.ToList(item.GetValue("SubTableAdapter"));
                            foreach (var adp in subTableAdps)
                            {
                                var adpItem = new SubTableAdpItem();
                                adpItem.FieldCode = adp.GetValue("FieldCode");
                                adpItem.AdpField = adp.GetValue("ParamField");
                                adpItem.DefaultValue = adp.GetValue("DefaultValue");
                                calItem.SubTableAdapters.Add(adpItem);
                            }
                        }
                        _calculateItems.Add(calItem);
                    }
                }
                return _calculateItems;
            }
        }



        List<TriggerFieldItem> _calTriggerFields = null;
        [NotMapped]
        [JsonIgnore]
        public List<TriggerFieldItem> CalTriggerFields
        {
            get
            {
                if (_calTriggerFields == null)
                {
                    _calTriggerFields = new List<TriggerFieldItem>();
                    foreach (var item in this.CalculateItems)
                    {
                        var fieldList = item.TriggerFields.Split(',');
                        foreach (var field in fieldList)
                        {
                            var triggerField = _calTriggerFields.FirstOrDefault(c => c.FieldCode == field.Trim('{', '}'));
                            if (triggerField == null)
                            {
                                triggerField = new TriggerFieldItem();
                                triggerField.FieldCode = field.Trim('{', '}');
                                triggerField.CalItemCodes = item.FieldCode.Trim('{', '}');
                                _calTriggerFields.Add(triggerField);
                            }
                            else
                            {
                                if (!triggerField.CalItemCodes.Split(',').Contains(item.FieldCode))
                                {
                                    triggerField.CalItemCodes += "," + item.FieldCode.Trim('{', '}');
                                }
                            }
                        }
                    }
                }
                return _calTriggerFields;
            }
        }
    }
}
