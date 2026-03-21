
using MongoDB.Bson;
using System;

namespace FiveHundred.Repository
{
    public class MongoEntity : IMongoEntity
    {
        public ObjectId Id { get; set; }
        public DateTime? Updated { get; set; }
    }

    public interface IMongoEntity
    {
        public ObjectId Id { get; set; }
    }
}
