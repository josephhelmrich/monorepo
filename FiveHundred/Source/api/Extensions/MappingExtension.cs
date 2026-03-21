using AutoMapper;
using FiveHundred.Models;
using FiveHundred.Repository;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using System;

namespace FiveHundred.Host
{
    internal static class MappingExtension
    {
        public static IServiceCollection AddMapping(this IServiceCollection services)
        {
            var mapping = new MapperConfiguration(cfg =>
            {
                // mongo entities (that have IDs)
                cfg.CreateEntityMap<EventModel, EventEntity>();
                cfg.CreateEntityMap<GameModel, GameEntity>();
                cfg.CreateEntityMap<TeamModel, TeamEntity>();
                cfg.CreateEntityMap<UserModel, UserEntity>();
                cfg.CreateEntityMap<HandModel, HandEntity>();
                // standard entities
                cfg.CreateMap<StatisticsModel, StatisticsEntity>().ReverseMap();
                cfg.CreateMap<ScoreSnapshotModel, ScoreSnapshotEntity>().ReverseMap();
                cfg.CreateMap<FuckinChadModel, FuckinChadEntity>().ReverseMap();
            });

            var mapper = mapping.CreateMapper();
            services.AddSingleton(mapper);

            return services;
        }

        private static IMappingExpression<TEntity, TModel> CreateEntityMap<TModel, TEntity>(this IMapperConfigurationExpression cfg) 
            where TModel : MongoModel 
            where TEntity: MongoEntity 
        {
            // create two-way map that converts Id:ObjectId <=> Id:String
            return 
                cfg.CreateMap<TModel, TEntity>()
                .ForMember(x => x.Id, opt => opt.MapFrom((m, e, o) => string.IsNullOrWhiteSpace(m.Id) ? ObjectId.Empty : ObjectId.Parse(m.Id)))
                .ForMember(x => x.Updated, opt => opt.MapFrom((m, e, o) => DateTime.UtcNow))
                .ReverseMap()
                    .ForMember(x => x.Id, opt => opt.MapFrom((e, m, o) => e.Id == ObjectId.Empty ? string.Empty : e.Id.ToString())); // ObjectId => string
        }
    }
}
