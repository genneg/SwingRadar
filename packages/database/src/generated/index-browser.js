
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  name: 'name',
  from_date: 'from_date',
  to_date: 'to_date',
  country: 'country',
  city: 'city',
  website: 'website',
  style: 'style',
  dance_styles: 'dance_styles',
  primary_style: 'primary_style',
  difficulty_level: 'difficulty_level',
  event_types: 'event_types',
  description: 'description',
  ai_quality_score: 'ai_quality_score',
  ai_completeness_score: 'ai_completeness_score',
  extraction_method: 'extraction_method',
  created_at: 'created_at',
  updated_at: 'updated_at',
  image_url: 'image_url'
};

exports.Prisma.ExternalEventTeacherScalarFieldEnum = {
  event_id: 'event_id',
  teacher_id: 'teacher_id',
  role: 'role'
};

exports.Prisma.ExternalEventVenueScalarFieldEnum = {
  id: 'id',
  event_id: 'event_id',
  name: 'name',
  address: 'address',
  type: 'type'
};

exports.Prisma.TeacherScalarFieldEnum = {
  id: 'id',
  name: 'name',
  bio: 'bio',
  website: 'website',
  ai_bio_summary: 'ai_bio_summary',
  ai_relevance_score: 'ai_relevance_score',
  image_url: 'image_url',
  specializations: 'specializations',
  experience_levels: 'experience_levels',
  teaching_since: 'teaching_since',
  credentials: 'credentials',
  preferred_events: 'preferred_events'
};

exports.Prisma.MusicianScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  bio: 'bio',
  avatar: 'avatar',
  verified: 'verified',
  instruments: 'instruments',
  music_genres: 'music_genres',
  primary_genre: 'primary_genre',
  performance_types: 'performance_types',
  yearsActive: 'yearsActive',
  website: 'website',
  email: 'email',
  followerCount: 'followerCount',
  eventCount: 'eventCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  image_url: 'image_url'
};

exports.Prisma.Event_musiciansScalarFieldEnum = {
  id: 'id',
  event_id: 'event_id',
  musician_id: 'musician_id',
  role: 'role',
  set_times: 'set_times',
  created_at: 'created_at'
};

exports.Prisma.Event_pricesScalarFieldEnum = {
  id: 'id',
  event_id: 'event_id',
  type: 'type',
  amount: 'amount',
  currency: 'currency',
  deadline: 'deadline',
  description: 'description',
  available: 'available',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  avatar: 'avatar',
  verified: 'verified',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  password: 'password',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.UserPreferencesScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  email_notifications: 'email_notifications',
  push_notifications: 'push_notifications',
  new_event_notifications: 'new_event_notifications',
  deadlineReminders: 'deadlineReminders',
  weeklyDigest: 'weeklyDigest',
  followingUpdates: 'followingUpdates',
  theme: 'theme',
  language: 'language',
  defaultCountry: 'defaultCountry',
  defaultCity: 'defaultCity',
  searchRadius: 'searchRadius',
  timezone: 'timezone',
  preferred_dance_styles: 'preferred_dance_styles',
  experience_level: 'experience_level',
  preferred_event_types: 'preferred_event_types',
  skill_levels: 'skill_levels',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SavedSearchScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  name: 'name',
  query: 'query',
  created_at: 'created_at'
};

exports.Prisma.UserFollowTeacherScalarFieldEnum = {
  user_id: 'user_id',
  teacher_id: 'teacher_id',
  created_at: 'created_at'
};

exports.Prisma.UserFollowMusicianScalarFieldEnum = {
  user_id: 'user_id',
  musician_id: 'musician_id',
  created_at: 'created_at'
};

exports.Prisma.UserFollowEventScalarFieldEnum = {
  user_id: 'user_id',
  event_id: 'event_id',
  created_at: 'created_at'
};

exports.Prisma.UserNotificationScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  type: 'type',
  title: 'title',
  message: 'message',
  read: 'read',
  created_at: 'created_at'
};

exports.Prisma.Social_mediaScalarFieldEnum = {
  id: 'id',
  entity_type: 'entity_type',
  entity_id: 'entity_id',
  platform: 'platform',
  url: 'url',
  username: 'username',
  is_verified: 'is_verified',
  follower_count: 'follower_count',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  Event: 'Event',
  ExternalEventTeacher: 'ExternalEventTeacher',
  ExternalEventVenue: 'ExternalEventVenue',
  Teacher: 'Teacher',
  Musician: 'Musician',
  event_musicians: 'event_musicians',
  event_prices: 'event_prices',
  User: 'User',
  Account: 'Account',
  UserPreferences: 'UserPreferences',
  SavedSearch: 'SavedSearch',
  UserFollowTeacher: 'UserFollowTeacher',
  UserFollowMusician: 'UserFollowMusician',
  UserFollowEvent: 'UserFollowEvent',
  UserNotification: 'UserNotification',
  social_media: 'social_media'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
