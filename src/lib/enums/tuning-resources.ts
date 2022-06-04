import { getAllEnumValues } from "../common/helpers";

/**
 * Types for tuning resources (i.e. any XML resource that is loaded as tuning).
 */
enum TuningResourceType {
  Achievement = 0x78559E9E,
  AchievementCategory = 0x2451C101,
  AchievementCollection = 0x04D2B465,
  Action = 0x0C772E27,
  Animation = 0xEE17C6AD,
  AspirationCategory = 0xE350DBD8,
  AspirationTrack = 0xC020FCAD,
  Aspiration = 0x28B64675,
  AwayAction = 0xAFADAC48,
  Balloon = 0xEC6A8FC6,
  Breed = 0x341D3F25,
  Broadcaster = 0xDEBAFB73,
  BucksPerk = 0xEC3DA10E,
  Buff = 0x6017E896,
  Business = 0x75D807F3,
  CasMenuItem = 0x0CBA50F4,
  CasMenu = 0x935A83C2,
  CasPreferenceCategory = 0xCE04FC4B,
  CasPreferenceItem = 0xEC68FD22,
  CasStoriesAnswer = 0x80F12D17,
  CasStoriesQuestion = 0x03246B9D,
  CasStoriesTraitChooser = 0x8DAD1549,
  CallToAction = 0xF537B2E0,
  CareerEvent = 0x94420322,
  CareerGig = 0xCCDB0EDD,
  CareerLevel = 0x2C70ADF8,
  CareerTrack = 0x48C75CE3,
  Career = 0x73996BEB,
  ClubInteractionGroup = 0xFA0FFA34,
  ClubSeed = 0x2F59B437,
  ConditionalLayer = 0x9183DC91,
  DetectiveClue = 0x537449F6,
  DramaNode = 0x2553F435,
  Ensemble = 0xB9881120,
  GameRuleset = 0xE1477E18,
  Headline = 0xF401205D,
  HolidayDefinition = 0x0E316F6D,
  HolidayTradition = 0x3FCD2486,
  HouseholdMilestone = 0x3972E6F3,
  Interaction = 0xE882D22F,
  LotDecorationPreset = 0xDE1EF8FB,
  LotDecoration = 0xFE2DB1AB,
  LotTuning = 0xD8800D66,
  Mood = 0xBA7B60B8,
  Narrative = 0x3E753C39,
  NotebookEntry = 0x9902FA76,
  ObjectPart = 0x7147A350,
  ObjectState = 0x5B02819E,
  Object = 0xB61DE6B4,
  Objective = 0x0069453E,
  OpenStreetDirector = 0x4B6FDEC4,
  PieMenuCategory = 0x03E9D964,
  Posture = 0xAD6FDF1F,
  RabbitHole = 0xB16AD2FA,
  Recipe = 0xEB97F823,
  Region = 0x51E7A18D,
  RelationshipBit = 0x0904DF10,
  RelationshipLock = 0xAE34E673,
  Reward = 0x6FA49828,
  RoleState = 0x0E4D15FB,
  Royalty = 0x37EF2EE7,
  Season = 0xC98DD45E,
  ServiceNpc = 0x9CC21262,
  Sickness = 0xC3FBD8DE,
  SimFilter = 0x6E0DDA9F,
  SimInfoFixup = 0xE2581892,
  SimTemplate = 0x0CA4C78B,
  SituationGoalSet = 0x9DF2F1F2,
  SituationGoal = 0x598F28E7,
  SituationJob = 0x9C07855F,
  Situation = 0xFBC3AEEB,
  SlotTypeSet = 0x3F163505,
  SlotType = 0x69A5DAA4,
  Snippet = 0x7DF2169C,
  SocialGroup = 0x2E47A104,
  Spell = 0x1F3413D9,
  Scommodity = 0x51077643,
  Statistic = 0x339BC5BD,
  Strategy = 0x6224C9D6,
  Street = 0xF6E4CB00,
  Subroot = 0xB7FF8F95,
  TagSet = 0x49395302,
  TemplateChooser = 0x48C2D5ED,
  TestBasedScore = 0x4F739CEE,
  Topic = 0x738E6C56,
  Trait = 0xCB5FDDC7,
  Tuning = 0x03B33DDF,
  TutorialTip = 0x8FB3E0B1,
  Tutorial = 0xE04A24A3,
  UniversityCourseData = 0x291CAFBE,
  UniversityMajor = 0x2758B34B,
  University = 0xD958D5B1,
  UserInterfaceInfo = 0xB8BF1A63,
  Venue = 0xE6BBD7DE,
  WalkBy = 0x3FD6243E,
  WeatherEvent = 0x5806F5BA,
  WeatherForecast = 0x497F3271,
  ZoneDirector = 0xF958A092,
  ZoneModifier = 0x3C1D8799,
}

namespace TuningResourceType {
  /**
   * Returns an array of all tuning resource types.
   */
  export function all(): TuningResourceType[] {
    return getAllEnumValues(TuningResourceType);
  }

  /**
   * Returns the TuningResourceType value for tunings with the given type 
   * attribute. This attribute is either the `n` in R nodes in combined
   * tuning, or the `i` in regular tuning instances. If there is no type for
   * the given attribute, `Tuning` is assumed.
   * 
   * @param attr Attribute to parse as a tuning type
   */
  export function parseAttr(attr: string): TuningResourceType {
    // This switch case is generated by another program
    switch (attr) {
      case "achievement_category": return TuningResourceType.AchievementCategory;
      case "achievement_collection": return TuningResourceType.AchievementCollection;
      case "achievement": return TuningResourceType.Achievement;
      case "action": return TuningResourceType.Action;
      case "animation": return TuningResourceType.Animation;
      case "aspiration_category": return TuningResourceType.AspirationCategory;
      case "aspiration_track": return TuningResourceType.AspirationTrack;
      case "aspiration": return TuningResourceType.Aspiration;
      case "away_action": return TuningResourceType.AwayAction;
      case "balloon": return TuningResourceType.Balloon;
      case "breed": return TuningResourceType.Breed;
      case "broadcaster": return TuningResourceType.Broadcaster;
      case "bucks_perk": return TuningResourceType.BucksPerk;
      case "buff": return TuningResourceType.Buff;
      case "business": return TuningResourceType.Business;
      case "call_to_action": return TuningResourceType.CallToAction;
      case "career_event": return TuningResourceType.CareerEvent;
      case "career_gig": return TuningResourceType.CareerGig;
      case "career_level": return TuningResourceType.CareerLevel;
      case "career_track": return TuningResourceType.CareerTrack;
      case "career": return TuningResourceType.Career;
      case "cas_menu_item": return TuningResourceType.CasMenuItem;
      case "cas_menu": return TuningResourceType.CasMenu;
      case "cas_preference_category": return TuningResourceType.CasPreferenceCategory;
      case "cas_preference_item": return TuningResourceType.CasPreferenceItem;
      case "cas_stories_answer": return TuningResourceType.CasStoriesAnswer;
      case "cas_stories_question": return TuningResourceType.CasStoriesQuestion;
      case "cas_stories_trait_chooser": return TuningResourceType.CasStoriesTraitChooser;
      case "club_interaction_group": return TuningResourceType.ClubInteractionGroup;
      case "club_seed": return TuningResourceType.ClubSeed;
      case "conditional_layer": return TuningResourceType.ConditionalLayer;
      case "detective_clue": return TuningResourceType.DetectiveClue;
      case "drama_node": return TuningResourceType.DramaNode;
      case "ensemble": return TuningResourceType.Ensemble;
      case "game_ruleset": return TuningResourceType.GameRuleset;
      case "headline": return TuningResourceType.Headline;
      case "holiday_definition": return TuningResourceType.HolidayDefinition;
      case "holiday_tradition": return TuningResourceType.HolidayTradition;
      case "household_milestone": return TuningResourceType.HouseholdMilestone;
      case "interaction": return TuningResourceType.Interaction;
      case "lot_decoration_preset": return TuningResourceType.LotDecorationPreset;
      case "lot_decoration": return TuningResourceType.LotDecoration;
      case "lot_tuning": return TuningResourceType.LotTuning;
      case "mood": return TuningResourceType.Mood;
      case "narrative": return TuningResourceType.Narrative;
      case "notebook_entry": return TuningResourceType.NotebookEntry;
      case "object_part": return TuningResourceType.ObjectPart;
      case "object_state": return TuningResourceType.ObjectState;
      case "object": return TuningResourceType.Object;
      case "objective": return TuningResourceType.Objective;
      case "open_street_director": return TuningResourceType.OpenStreetDirector;
      case "pie_menu_category": return TuningResourceType.PieMenuCategory;
      case "posture": return TuningResourceType.Posture;
      case "rabbit_hole": return TuningResourceType.RabbitHole;
      case "recipe": return TuningResourceType.Recipe;
      case "region": return TuningResourceType.Region;
      case "relbit": return TuningResourceType.RelationshipBit;
      case "relationship_lock": return TuningResourceType.RelationshipLock;
      case "reward": return TuningResourceType.Reward;
      case "role_state": return TuningResourceType.RoleState;
      case "royalty": return TuningResourceType.Royalty;
      case "season": return TuningResourceType.Season;
      case "service_npc": return TuningResourceType.ServiceNpc;
      case "sickness": return TuningResourceType.Sickness;
      case "sim_filter": return TuningResourceType.SimFilter;
      case "sim_info_fixup": return TuningResourceType.SimInfoFixup;
      case "sim_template": return TuningResourceType.SimTemplate;
      case "situation_goal_set": return TuningResourceType.SituationGoalSet;
      case "situation_goal": return TuningResourceType.SituationGoal;
      case "situation_job": return TuningResourceType.SituationJob;
      case "situation": return TuningResourceType.Situation;
      case "slot_type_set": return TuningResourceType.SlotTypeSet;
      case "slot_type": return TuningResourceType.SlotType;
      case "snippet": return TuningResourceType.Snippet;
      case "social_group": return TuningResourceType.SocialGroup;
      case "spell": return TuningResourceType.Spell;
      case "scommodity": return TuningResourceType.Scommodity;
      case "statistic": return TuningResourceType.Statistic;
      case "strategy": return TuningResourceType.Strategy;
      case "street": return TuningResourceType.Street;
      case "subroot": return TuningResourceType.Subroot;
      case "tag_set": return TuningResourceType.TagSet;
      case "template_chooser": return TuningResourceType.TemplateChooser;
      case "test_based_score": return TuningResourceType.TestBasedScore;
      case "topic": return TuningResourceType.Topic;
      case "trait": return TuningResourceType.Trait;
      case "tutorial_tip": return TuningResourceType.TutorialTip;
      case "tutorial": return TuningResourceType.Tutorial;
      case "university_course_data": return TuningResourceType.UniversityCourseData;
      case "university_major": return TuningResourceType.UniversityMajor;
      case "university": return TuningResourceType.University;
      case "user_interface_info": return TuningResourceType.UserInterfaceInfo;
      case "venue": return TuningResourceType.Venue;
      case "walk_by": return TuningResourceType.WalkBy;
      case "weather_event": return TuningResourceType.WeatherEvent;
      case "weather_forecast": return TuningResourceType.WeatherForecast;
      case "zone_director": return TuningResourceType.ZoneDirector;
      case "zone_modifier": return TuningResourceType.ZoneModifier;
      default: return TuningResourceType.Tuning;
    }
  }

  /**
   * Returns the `i` attribute to use for a tuning file of the given type. If
   * there is no attribute for the given type, result is null.
   * 
   * @param type Tuning type to get attribute for
   */
  export function getAttr(type: TuningResourceType): string {
    // This switch case is generated by another program
    switch (type) {
      case TuningResourceType.AchievementCategory: return "achievement_category";
      case TuningResourceType.AchievementCollection: return "achievement_collection";
      case TuningResourceType.Achievement: return "achievement";
      case TuningResourceType.Action: return "action";
      case TuningResourceType.Animation: return "animation";
      case TuningResourceType.AspirationCategory: return "aspiration_category";
      case TuningResourceType.AspirationTrack: return "aspiration_track";
      case TuningResourceType.Aspiration: return "aspiration";
      case TuningResourceType.AwayAction: return "away_action";
      case TuningResourceType.Balloon: return "balloon";
      case TuningResourceType.Breed: return "breed";
      case TuningResourceType.Broadcaster: return "broadcaster";
      case TuningResourceType.BucksPerk: return "bucks_perk";
      case TuningResourceType.Buff: return "buff";
      case TuningResourceType.Business: return "business";
      case TuningResourceType.CallToAction: return "call_to_action";
      case TuningResourceType.CareerEvent: return "career_event";
      case TuningResourceType.CareerGig: return "career_gig";
      case TuningResourceType.CareerLevel: return "career_level";
      case TuningResourceType.CareerTrack: return "career_track";
      case TuningResourceType.Career: return "career";
      case TuningResourceType.CasMenuItem: return "cas_menu_item";
      case TuningResourceType.CasMenu: return "cas_menu";
      case TuningResourceType.CasPreferenceCategory: return "cas_preference_category";
      case TuningResourceType.CasPreferenceItem: return "cas_preference_item";
      case TuningResourceType.CasStoriesAnswer: return "cas_stories_answer";
      case TuningResourceType.CasStoriesQuestion: return "cas_stories_question";
      case TuningResourceType.CasStoriesTraitChooser: return "cas_stories_trait_chooser";
      case TuningResourceType.ClubInteractionGroup: return "club_interaction_group";
      case TuningResourceType.ClubSeed: return "club_seed";
      case TuningResourceType.ConditionalLayer: return "conditional_layer";
      case TuningResourceType.DetectiveClue: return "detective_clue";
      case TuningResourceType.DramaNode: return "drama_node";
      case TuningResourceType.Ensemble: return "ensemble";
      case TuningResourceType.GameRuleset: return "game_ruleset";
      case TuningResourceType.Headline: return "headline";
      case TuningResourceType.HolidayDefinition: return "holiday_definition";
      case TuningResourceType.HolidayTradition: return "holiday_tradition";
      case TuningResourceType.HouseholdMilestone: return "household_milestone";
      case TuningResourceType.Interaction: return "interaction";
      case TuningResourceType.LotDecorationPreset: return "lot_decoration_preset";
      case TuningResourceType.LotDecoration: return "lot_decoration";
      case TuningResourceType.LotTuning: return "lot_tuning";
      case TuningResourceType.Mood: return "mood";
      case TuningResourceType.Narrative: return "narrative";
      case TuningResourceType.NotebookEntry: return "notebook_entry";
      case TuningResourceType.ObjectPart: return "object_part";
      case TuningResourceType.ObjectState: return "object_state";
      case TuningResourceType.Object: return "object";
      case TuningResourceType.Objective: return "objective";
      case TuningResourceType.OpenStreetDirector: return "open_street_director";
      case TuningResourceType.PieMenuCategory: return "pie_menu_category";
      case TuningResourceType.Posture: return "posture";
      case TuningResourceType.RabbitHole: return "rabbit_hole";
      case TuningResourceType.Recipe: return "recipe";
      case TuningResourceType.Region: return "region";
      case TuningResourceType.RelationshipBit: return "relbit";
      case TuningResourceType.RelationshipLock: return "relationship_lock";
      case TuningResourceType.Reward: return "reward";
      case TuningResourceType.RoleState: return "role_state";
      case TuningResourceType.Royalty: return "royalty";
      case TuningResourceType.Season: return "season";
      case TuningResourceType.ServiceNpc: return "service_npc";
      case TuningResourceType.Sickness: return "sickness";
      case TuningResourceType.SimFilter: return "sim_filter";
      case TuningResourceType.SimInfoFixup: return "sim_info_fixup";
      case TuningResourceType.SimTemplate: return "sim_template";
      case TuningResourceType.SituationGoalSet: return "situation_goal_set";
      case TuningResourceType.SituationGoal: return "situation_goal";
      case TuningResourceType.SituationJob: return "situation_job";
      case TuningResourceType.Situation: return "situation";
      case TuningResourceType.SlotTypeSet: return "slot_type_set";
      case TuningResourceType.SlotType: return "slot_type";
      case TuningResourceType.Snippet: return "snippet";
      case TuningResourceType.SocialGroup: return "social_group";
      case TuningResourceType.Spell: return "spell";
      case TuningResourceType.Scommodity: return "scommodity";
      case TuningResourceType.Statistic: return "statistic";
      case TuningResourceType.Strategy: return "strategy";
      case TuningResourceType.Street: return "street";
      case TuningResourceType.Subroot: return "subroot";
      case TuningResourceType.TagSet: return "tag_set";
      case TuningResourceType.TemplateChooser: return "template_chooser";
      case TuningResourceType.TestBasedScore: return "test_based_score";
      case TuningResourceType.Topic: return "topic";
      case TuningResourceType.Trait: return "trait";
      case TuningResourceType.TutorialTip: return "tutorial_tip";
      case TuningResourceType.Tutorial: return "tutorial";
      case TuningResourceType.UniversityCourseData: return "university_course_data";
      case TuningResourceType.UniversityMajor: return "university_major";
      case TuningResourceType.University: return "university";
      case TuningResourceType.UserInterfaceInfo: return "user_interface_info";
      case TuningResourceType.Venue: return "venue";
      case TuningResourceType.WalkBy: return "walk_by";
      case TuningResourceType.WeatherEvent: return "weather_event";
      case TuningResourceType.WeatherForecast: return "weather_forecast";
      case TuningResourceType.ZoneDirector: return "zone_director";
      case TuningResourceType.ZoneModifier: return "zone_modifier";
      default: return null;
    }
  }
}

// `export default enum` not supported by TS
export default TuningResourceType;
