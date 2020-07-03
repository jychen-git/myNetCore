using KAJ.Common.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Text;

namespace KAJ.Model
{
    public abstract class BaseModel
    {
        public Dictionary<string, object> ToDic()
        {
            var type = this.GetType();
            Dictionary<string, object> dic = new Dictionary<string, object>();
            PropertyInfo[] arrPtys = type.GetProperties();
            foreach (PropertyInfo destPty in arrPtys)
            {
                if (destPty.CanRead == false)
                    continue;
                if (destPty.PropertyType.Name == "ICollection`1")
                    continue;
                if ((destPty.PropertyType.IsClass && destPty.PropertyType.Name != "String") || destPty.PropertyType.IsArray || destPty.PropertyType.IsInterface)
                    continue;
                object value = destPty.GetValue(this, null);
                dic.Add(destPty.Name, value);
            }
            return dic;
        }

        public List<PropertyInfo> GetProperties()
        {
            Type type = this.GetType();
            var propInfos = type.GetProperties().Where(p => p.PropertyType == typeof(string) || p.PropertyType == typeof(DateTime)
              || p.PropertyType == typeof(double) || p.PropertyType == typeof(float) || p.PropertyType == typeof(decimal)
              || p.PropertyType.IsValueType).Where(d => d.PropertyType != typeof(bool)).ToList();
            return propInfos;
        }

        public PropertyInfo GetProperty(string propertyName, bool canReturnNull = false)
        {
            Type type = this.GetType();
            PropertyInfo[] propInfos = type.GetProperties();
            PropertyInfo propInfo = propInfos.FirstOrDefault
                (p => p.Name == propertyName);
            if (propInfo == null)
                if (canReturnNull)
                    return null;
                else
                    throw new Exception("没有找到相应的属性，操作失败！");
            return propInfo;
        }

        public void SetProperty(string name, object value)
        {
            var pi = this.GetProperty(name, true);
            if (pi == null) return;
            if (!pi.CanWrite) return;
            if (pi.PropertyType.FullName == "System.String")
            {
                if (value == null) return;
                pi.SetValue(this, value.ToString(), null);
            }
            if (pi.PropertyType.IsGenericType)
            {
                if (value == null || value == DBNull.Value || String.IsNullOrEmpty(value.ToString()))
                {
                    pi.SetValue(this, null, null);
                    return;
                }
                if (pi.PropertyType.FullName.IndexOf("Int32") > 0)
                    value = Convert.ToInt32(value);
                else if (pi.PropertyType.FullName.IndexOf("Decimal") > 0)
                    value = Convert.ToDecimal(value);
                else if (pi.PropertyType.FullName.IndexOf("Double") > 0)
                    value = Convert.ToDouble(value);
                else if (pi.PropertyType.FullName.IndexOf("DateTime") > 0)
                    value = Convert.ToDateTime(value);
                pi.SetValue(this, value, null);
            }
            else
            {
                MethodInfo mis = pi.PropertyType.GetMethod("Parse", new Type[] { typeof(string) });
                if (mis != null && !String.IsNullOrEmpty(value.ToString()))
                    pi.SetValue(this, mis.Invoke(null, new object[] { value.ToString() }), null);
            }
        }

        public string GetPropertyString(string name)
        {
            var property = this.GetProperty(name, true);
            if (property == null) return string.Empty;
            object obj = property.GetValue(this, null);
            if (obj == null || obj == DBNull.Value)
                return string.Empty;
            else
                return obj.ToString();
        }

        public object GetPropertyValue(string name)
        {
            var property = this.GetProperty(name, true);
            if (property == null) return null;
            return property.GetValue(this, null);
        }

        public T Clone<T>(bool newID = true) where T : BaseModel, new()
        {
            var proplist = this.GetProperties();
            var result = new T();
            foreach (var item in proplist)
            {
                if (item.PropertyType.FullName == "System.String")
                    result.SetProperty(item.Name, this.GetPropertyValue(item.Name));
                else
                {
                    var value = this.GetPropertyValue(item.Name);
                    if (value == null || value == DBNull.Value || String.IsNullOrEmpty(value.ToString()))
                        result.SetProperty(item.Name, null);
                    else if (item.PropertyType.FullName.IndexOf("Int32") >= 0)
                        value = Convert.ToInt32(value);
                    else if (item.PropertyType.FullName.IndexOf("Decimal") >= 0)
                        value = Convert.ToDecimal(value);
                    else if (item.PropertyType.FullName.IndexOf("Double") >= 0)
                        value = Convert.ToDouble(value);
                    else if (item.PropertyType.FullName.IndexOf("DateTime") >= 0)
                        value = Convert.ToDateTime(value);
                    result.SetProperty(item.Name, value);
                }
            }
            if (newID)
            {
                if (proplist.FirstOrDefault(d => d.Name == "ID").PropertyType == typeof(string))
                    result.SetProperty("ID", GuidHelper.CreateGuid());
            }
            return result;
        }
    }
}