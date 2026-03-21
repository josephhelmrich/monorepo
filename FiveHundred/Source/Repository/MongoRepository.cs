using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MongoDB.Bson;
using MongoDB.Driver;

namespace FiveHundred.Repository
{
    public class MongoRepository<TEntity, TModel> : IMongoRepository<TEntity, TModel> where TEntity : IMongoEntity
    {
        protected readonly string collectionName;
        protected readonly IMapper mapper;

        public IMongoCollection<TEntity> Collection { get; private set; }
#if DEBUG
        protected IMongoCollection<TEntity> Collection_Production { get; private set; }
#endif
        public MongoRepository(string collectionName, IMapper mapper)
        {
            var settings = MongoClientSettings.FromConnectionString(Constants.ConnectionString);
            var client = new MongoClient(settings);
            var database = client.GetDatabase(Constants.DatabaseName);
            this.Collection = database.GetCollection<TEntity>(collectionName);
#if DEBUG
            this.Collection_Production = database.GetCollection<TEntity>(Constants.EventCollection_Prod);
#endif
            this.collectionName = collectionName;
            this.mapper = mapper;
        }

        public string GenerateId()
        {
            return ObjectId.GenerateNewId().ToString();
        }

        public async Task<TModel> GetAsync(string id) => await GetAsync(ObjectId.Parse(id));

        public async Task<TModel> GetAsync(ObjectId id)
        {
            var result = await this.Collection.FindAsync(x => x.Id == id);
            return mapper.Map<TModel>(result.FirstOrDefault());
        }

        public async Task<IEnumerable<TModel>> FindAsync(Expression<Func<TEntity, bool>> filter)
        {
            var result = await this.Collection.FindAsync(filter);
            return mapper.Map<List<TModel>>(result.ToEnumerable());
        }

        public async Task<List<TEntity>> FindEntityAsync(Expression<Func<TEntity, bool>> filter)
        {
            return await this.FindEntityAsync(filter, null);
        }

        public async Task<List<TEntity>> FindEntityAsync(Expression<Func<TEntity, bool>> filter, FindOptions<TEntity, TEntity> options)
        {
            IAsyncCursor<TEntity> result;
            result = await this.Collection.FindAsync(filter, options);
            return await result.ToListAsync();
        }

        public async Task<TModel> FindFirst(Expression<Func<TEntity, bool>> filter, Expression<Func<TEntity, object>> sortField, bool descending = false)
        {
            var sort =
                descending?
                Builders<TEntity>.Sort.Descending(sortField) :
                Builders<TEntity>.Sort.Ascending(sortField);
            var result = await this.Collection.FindAsync(filter, new FindOptions<TEntity, TEntity>() { Sort = sort, Limit = 1});
            return mapper.Map<TModel>(result.FirstOrDefault());
        }
        public ObjectId ParseId(string id)
        {
            return ObjectId.Parse(id);
        }

        /// <summary>
        /// Returns true if an update occurrs otherwise false
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<bool> UpsertAsync(TModel model)
        {
            var entity = mapper.Map<TEntity>(model);
            var result = await this.Collection.ReplaceOneAsync(
                x => x.Id == entity.Id,
                entity,
                new ReplaceOptions() { IsUpsert = true }
            );

            return (result.MatchedCount > 0);
        }

        public async Task<long> DeleteAsync(string id) => await DeleteAsync(ObjectId.Parse(id));

        public async Task<long> DeleteAsync(ObjectId id)
        {
            var result = await this.Collection.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount;
        }

        public async Task<long> DeleteAsync(Expression<Func<TEntity, bool>> filter)
        {
            var result = await this.Collection.DeleteManyAsync(filter);
            return result.DeletedCount;
        }

        public async Task<long> DeleteAllAsync()
        {
            long countMain = 0;
            long countProd = 0;

            countMain = (await this.Collection.DeleteManyAsync(Builders<TEntity>.Filter.Empty)).DeletedCount;
#if DEBUG
            countProd = (await this.Collection_Production.DeleteManyAsync(Builders<TEntity>.Filter.Exists("PastGames.4", false))).DeletedCount;
#endif

            return countMain + countProd;
        }
    }
}
