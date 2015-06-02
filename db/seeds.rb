# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


board1 = Board.create

pad1 = Sample.create(name: "sample1", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/Boom-Kick.wav", :board_id => 1)
pad2 = Sample.create(name: "sample2", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/Electric-Bass-High-Bb-Staccato.wav", :board_id => 1)
pad3 = Sample.create(name: "sample3", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/ContactMic_Samples-NORM_79_Surprise_Sample_Pack.wav", :board_id => 1)
pad4 = Sample.create(name: "sample4", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/Cymbal_Zildjian_Avedis_12_st_mallets_07_Cymbal_Essentials.wav", :board_id => 1)
pad5 = Sample.create(name: "sample5", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/SD_militaire_synth_Synthdrum_PAck.wav", :board_id => 1)
pad6 = Sample.create(name: "sample6", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/booga_hit_doubleb06_World_Sounds_Vol1.wav", :board_id => 1)
pad7 = Sample.create(name: "sample7", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/ghana_bell_high_Bell_Essentials.wav", :board_id => 1)
pad8 = Sample.create(name: "sample8", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/glass2_Bell_Essentials.wav", :board_id => 1)
pad9 = Sample.create(name: "sample9", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/yipp23_Analog_Attitude.wav", :board_id => 1)