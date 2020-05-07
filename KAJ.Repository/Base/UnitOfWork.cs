using KAJ.IRepository.Base;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Repository.Base
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ISqlSugarClient _sqlSugarClient;

        public UnitOfWork(ISqlSugarClient sqlSugarClient)
        {
            _sqlSugarClient = sqlSugarClient;
        }

        public void BeginTran()
        {
            GetDbClient().BeginTran();
        }

        public void CommitTran()
        {
            GetDbClient().CommitTran();
        }

        public SqlSugarClient GetDbClient()
        {
            return (SqlSugarClient)_sqlSugarClient;
        }

        public void RollbackTran()
        {
            GetDbClient().RollbackTran();
        }
    }
}
