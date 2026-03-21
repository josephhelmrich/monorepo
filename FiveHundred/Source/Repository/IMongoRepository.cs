using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace FiveHundred.Repository
{
    public interface IMongoRepository<TEntity, TModel> where TEntity : IMongoEntity
    {
        string GenerateId();
        Task<long> DeleteAllAsync();
        Task<long> DeleteAsync(Expression<Func<TEntity, bool>> filter);
        Task<long> DeleteAsync(ObjectId id);
        Task<long> DeleteAsync(string id);
        Task<IEnumerable<TModel>> FindAsync(Expression<Func<TEntity, bool>> filter);
        Task<List<TEntity>> FindEntityAsync(Expression<Func<TEntity, bool>> filter);
        Task<List<TEntity>> FindEntityAsync(Expression<Func<TEntity, bool>> filter, FindOptions<TEntity, TEntity> options = null);
        Task<TModel> FindFirst(Expression<Func<TEntity, bool>> filter, Expression<Func<TEntity, object>> sortField, bool descending = false);
        Task<TModel> GetAsync(string id);
        Task<TModel> GetAsync(ObjectId id);
        Task<bool> UpsertAsync(TModel document);
        ObjectId ParseId(string id);
        IMongoCollection<TEntity> Collection { get; }
    }
}