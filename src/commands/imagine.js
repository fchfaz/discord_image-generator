const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const { REPLICATE_API_KEY } = require('../../config.json');
const models = require('../models');

module.exports = {
  run: async ({ interaction }) => {
    try {
      await interaction.deferReply();

      const { default: Replicate } = await import('replicate');

      const replicate = new Replicate({
        auth: REPLICATE_API_KEY,
      });

      const prompt = interaction.options.getString('prompt');
      const model = interaction.options.getString('model') || models[0].value;

      const output = await replicate.run(model, { input: { prompt } });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel(`Unduh`)
          .setStyle(ButtonStyle.Link)
          .setURL(`${output[0]}`)
          .setEmoji('1101133529607327764')
      );

      const resultEmbed = new EmbedBuilder()
        .setTitle('Gambar di-generate')
        .addFields({ name: 'Prompt', value: prompt })
        .setImage(output[0])
        .setColor('#44a3e3')
        .setFooter({
          text: `Di request oleh: ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      await interaction.editReply({
        embeds: [resultEmbed],
        components: [row],
      });
    } catch (error) {
      const errEmbed = new EmbedBuilder()
        .setTitle('Yah.. Error guys, coba ulang lagi ya!')
        .setDescription('```' + error + '```')
        .setColor(0xe32424);

      interaction.editReply({ embeds: [errEmbed] });
    }
  },

  data: {
    name: 'imagine',
    description: 'Generate gambar menggunakan prompt kata kunci.',
    options: [
      {
        name: 'prompt',
        description: 'Ketik katakunci',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'model',
        description: 'Pilih model gambar',
        type: ApplicationCommandOptionType.String,
        choices: models,
        required: false,
      },
    ],
  },
};
