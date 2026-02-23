import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';

import ThemeSwitch from "../components/ThemeSwitch"

const meta: Meta<typeof ThemeSwitch> = {
	component: ThemeSwitch,
	title: 'Components/ThemeSwitch',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof ThemeSwitch>;

export const Default: Story = {};

export default meta;