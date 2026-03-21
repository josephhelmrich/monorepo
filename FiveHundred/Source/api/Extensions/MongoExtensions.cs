using MongoDB.Driver;
using FiveHundred.Models;
using FiveHundred.Repository;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using AutoMapper;

namespace FiveHundred.Host
{
    public static class MongoExtensions
    {
        public static IServiceCollection AddMongoRepository<TEntity, TModel>(this IServiceCollection services, string collectionName) where TEntity : IMongoEntity
        {
            services.AddSingleton<IMongoRepository<TEntity, TModel>>(x => new MongoRepository<TEntity, TModel>(collectionName, x.GetService<IMapper>()));

            return services;
        }
    }
}
